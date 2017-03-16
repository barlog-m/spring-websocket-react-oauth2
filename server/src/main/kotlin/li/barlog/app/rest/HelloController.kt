package li.barlog.app.rest

import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(
	path = arrayOf("\${api.prefix}/home"),
	produces = arrayOf(MediaType.APPLICATION_JSON_UTF8_VALUE),
	consumes = arrayOf(MediaType.APPLICATION_JSON_UTF8_VALUE)
)
class HelloController {
	@RequestMapping("/greeting_message")
	fun greetingsMessage(): ResponseEntity<String>
		= ResponseEntity.ok("Hello")
}
