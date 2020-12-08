package agprojects.wiremock.springweb.controller

import agprojects.wiremock.commandrunner.CmdRunner
import agprojects.wiremock.config.ConfigController
import agprojects.wiremock.datasource.*
import agprojects.wiremock.datasource.repository.StubGroupRepository
import agprojects.wiremock.datasource.repository.StubRepository
import agprojects.wiremock.springweb.controller.model.Stub
import agprojects.wiremock.springweb.controller.model.StubGroup
import agprojects.wiremock.util.JSONUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.ui.Model
import org.springframework.web.bind.annotation.*
import java.io.File
import javax.servlet.http.HttpServletRequest

@Controller
class ManagerController {

    @Autowired
    private lateinit var configManager: ConfigController

    @Autowired
    private lateinit var commandRunner: CmdRunner

    @Autowired
    private lateinit var stubGroupRepository: StubGroupRepository

    @Autowired
    private lateinit var stubRepository: StubRepository

    @Value("\${wiremock.port}")
    val wireMockPort: Int? = 8081

    @GetMapping("/manager")
    fun manager(request: HttpServletRequest, model: Model): String {
        model.addAttribute("wiremockPort", wireMockPort)
        return "manager"
    }

    @GetMapping("/login")
    fun login() = "login"

    @GetMapping("/reload")
    @ResponseBody
    fun reloadWireMock(): String {
        val allStubs = arrayListOf<String>()

        val stubGroups = stubGroupRepository.findAll()
        stubGroups.forEach { stubGroup ->
            stubGroup?.stubs?.forEach { stubEntity ->
                if (JSONUtils.isJSONValid(stubEntity.stub)) {
                    allStubs.add(stubEntity.stub)
                }
            }
        }
        val completeStub = "{\"mappings\" : [${allStubs.joinToString(",")}]}"
        File(configManager.getWireMockMappingsFilePath(), "mapping.json").writeText(completeStub)

        commandRunner.reloadWireMockProcess()
        val wireMockProcessNumber = commandRunner.getWireMockProcessNumber()
        return wireMockProcessNumber.toString()
    }

    @GetMapping(
            value = ["/api/stubgroups"],
            produces = ["application/json"]
    )
    @ResponseBody
    fun getAllStubGroups(): List<StubGroup> {
        return stubGroupRepository.findAll(
                Sort.by(Sort.Direction.ASC, "order")
        ).filterNotNull().toStubGroups()
    }

    @PostMapping(
            value = ["/api/stubgroup"],
            produces = ["application/json"]
    )
    @ResponseBody
    fun saveStubGroup(@RequestBody stubGroup: StubGroup): StubGroup {
        val stubGroupEntity = stubGroup.toEntity()
        stubGroupRepository.save(stubGroupEntity)
        stubRepository.saveAll(stubGroupEntity.stubs)

        if (stubGroupEntity.stubs.isNotEmpty()) {
            reloadWireMock()
        }

        return stubGroupEntity.toStubGroup()
    }

    @PatchMapping(
            value = ["/api/stubgroup"],
            produces = ["application/json"]
    )
    @ResponseBody
    fun updateStubGroup(@RequestBody stubGroup: StubGroup): ResponseEntity<Any> {
        val stubGroupEntity = stubGroup.toEntity()
        stubGroupRepository.save(stubGroupEntity)
        return ResponseEntity(HttpStatus.OK)
    }

    @DeleteMapping(
            value = ["/api/stubgroup/{id}"]
    )
    fun deleteStubGroup(@PathVariable id: Long): ResponseEntity<Any> {
        stubGroupRepository.findById(id)
                .takeIf { it.isPresent }?.get()?.let {
                    stubGroupRepository.delete(it)
                    stubRepository.deleteAll(it.stubs)
                }
        reloadWireMock()
        return ResponseEntity(HttpStatus.OK)
    }

    @PostMapping(
            value = ["/api/stubgroup/{stubGroupId}/stub"],
            produces = ["application/json"]
    )
    @ResponseBody
    fun saveStub(
            @PathVariable stubGroupId: Long,
            @RequestBody stub: Stub): Stub {
        val stubGroupEntity = stub.toStubEntity(stubGroupId)
        val stubEntity = stubRepository.save(stubGroupEntity)
        reloadWireMock()
        return stubEntity.toStub()
    }

    @DeleteMapping(
            value = ["/api/stub/{id}"]
    )
    @ResponseBody
    fun deleteStub(@PathVariable id: Long): ResponseEntity<Any> {
        stubRepository.deleteById(id)
        reloadWireMock()
        return ResponseEntity(HttpStatus.OK)
    }

}
