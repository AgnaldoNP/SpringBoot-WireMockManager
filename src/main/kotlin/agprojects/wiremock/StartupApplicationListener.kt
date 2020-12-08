package agprojects.wiremock

import agprojects.wiremock.config.ConfigController
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationListener
import org.springframework.context.event.ContextRefreshedEvent
import org.springframework.stereotype.Component

@Component
class StartupApplicationListener : ApplicationListener<ContextRefreshedEvent?> {
    @Autowired
    private lateinit var configController: ConfigController

    override fun onApplicationEvent(event: ContextRefreshedEvent) {
        configController.onApplicationStart()
    }
}