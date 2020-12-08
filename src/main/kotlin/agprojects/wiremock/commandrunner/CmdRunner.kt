package agprojects.wiremock.commandrunner

import agprojects.wiremock.config.ConfigController
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.io.BufferedReader
import java.io.InputStreamReader

@Service
class CmdRunner {

    @Autowired
    private lateinit var configmanager: ConfigController

    @Value("\${wiremock.file-name}")
    lateinit var wireMockFileName: String

    @Value("\${wiremock.port}")
    val wireMockPort: Int? = 8081

    fun runCommand(command: String): String? {
        val cmd = arrayOf("/bin/sh", "-c", command)
        val process = Runtime.getRuntime().exec(cmd)

        val out = StringBuilder()
        val br = BufferedReader(InputStreamReader(process.inputStream))
        var line: String?
        var previous: String? = null
        while (br.readLine().also { line = it } != null) {
            if (line != previous) {
                previous = line
                out.append(line).append('\n')
                println(line)
            }
        }

        return if (process.waitFor() == 0) {
            out.toString()
        } else {
            null
        }
    }

    fun getWireMockProcessNumber(): Int? {
        return try {
            val wireMockProcesses = runCommand("ps -aux | grep  -i $wireMockFileName | grep -i $wireMockPort")
            val processLine = wireMockProcesses?.split("\n")?.firstOrNull { it.contains("java -jar") }
            val processNumber = processLine?.split(" ")?.first { it.toIntOrNull() != null}?.toInt()
            processNumber
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }

    fun stopWireMockProcess() {
        getWireMockProcessNumber()?.let {
            val killWireMockProcessCommand = "kill -9 $it"
            println(killWireMockProcessCommand)
            runCommand(killWireMockProcessCommand)
        }
    }

    fun startWireMockProcess() {
        val path = configmanager.wireMockBasePath
        val jarName = configmanager.wireMockFileName
        val port = configmanager.wireMockPort

        val wireMockStartCommand = "cd $path && java -jar $jarName --port $port &"
        println(wireMockStartCommand)
        runCommand(wireMockStartCommand)
    }

    fun reloadWireMockProcess() {
        stopWireMockProcess()
        startWireMockProcess()
    }

}
