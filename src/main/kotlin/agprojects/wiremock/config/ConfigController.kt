package agprojects.wiremock.config

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.ResourceLoader
import org.springframework.stereotype.Service
import java.io.File
import java.io.FileOutputStream

@Service
class ConfigController {

    @Value("\${wiremock.base-path}")
    lateinit var wireMockBasePath: String

    @Value("\${wiremock.file-name}")
    lateinit var wireMockFileName: String

    @Value("\${wiremock.port}")
    val wireMockPort: Int? = 8081

    fun onApplicationStart() {
        createWireMockDir()
        copyWireMockJarIfNecessary()
    }

    private fun getWireMockFilePath() =
            File(wireMockBasePath.replace("~", System.getProperty("user.home")))

    fun getWireMockMappingsFilePath() =
            File(getWireMockFilePath(), "mappings")

    private fun createWireMockDir() {
        getWireMockFilePath().takeIf { !it.exists() }?.let {
            it.mkdirs()
        }
        getWireMockMappingsFilePath().takeIf { !it.exists() }?.let {
            it.mkdirs()
        }
    }

    @Autowired
    lateinit var resourceLoader: ResourceLoader

    private fun copyWireMockJarIfNecessary() {
        File(getWireMockFilePath(), wireMockFileName).takeIf { !it.exists() }?.let {
            val resource = resourceLoader.getResource("classpath:assets/$wireMockFileName")
            resource.inputStream
            FileOutputStream(it).use { fileOut ->
                resource.inputStream.copyTo(fileOut)
            }
        }
    }

}