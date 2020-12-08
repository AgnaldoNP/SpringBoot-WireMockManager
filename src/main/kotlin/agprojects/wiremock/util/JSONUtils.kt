package agprojects.wiremock.util

import com.google.gson.Gson
import com.google.gson.JsonSyntaxException

object JSONUtils {
    fun isJSONValid(jsonInString: String?): Boolean {
        return try {
            Gson().fromJson(jsonInString, Any::class.java)
            true
        } catch (ex: JsonSyntaxException) {
            false
        }
    }
}