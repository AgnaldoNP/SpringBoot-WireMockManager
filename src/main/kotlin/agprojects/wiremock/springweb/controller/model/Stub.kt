package agprojects.wiremock.springweb.controller.model

class Stub(
        var id: Long = 0,
        var name: String,
        var description: String? = "",
        val order: Int = 0,
        var stub: String
)
