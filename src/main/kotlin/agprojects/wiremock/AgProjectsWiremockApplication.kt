package agprojects.wiremock

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.ComponentScan

@SpringBootApplication
@ComponentScan
class AgProjectsWiremockApplication

fun main(args: Array<String>) {
    runApplication<AgProjectsWiremockApplication>(*args)
}