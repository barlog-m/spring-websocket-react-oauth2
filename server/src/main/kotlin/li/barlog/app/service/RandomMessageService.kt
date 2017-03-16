package li.barlog.app.service

import li.barlog.app.model.Message
import mu.KLogging
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class RandomMessageService(
	private val messagingTemplate: SimpMessagingTemplate
) {
	companion object : KLogging()

	@Scheduled(fixedRate = 3000)
	fun generate() {
		val message = Message(UUID.randomUUID().toString())
		logger.info { "message: $message" }
		messagingTemplate.convertAndSend("/messages", message)
	}
}
