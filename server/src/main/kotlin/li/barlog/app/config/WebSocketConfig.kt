package li.barlog.app.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.server.standard.ServletServerContainerFactoryBean

@Configuration
@EnableWebSocketMessageBroker
open class WebSocketConfig : AbstractWebSocketMessageBrokerConfigurer() {
	private val BUFFER_SIZE = 65535

	@Value("\${ws.prefix}")
	private val wsPrefix = ""

	@Bean
	open fun stompHeartbeatThreadBool() : ThreadPoolTaskScheduler {
		val p = ThreadPoolTaskScheduler()
		p.poolSize = 1
		p.threadNamePrefix = "stomp-heartbeat-thread-"
		p.initialize()
		return p
	}

	@Bean
	open fun createWebSocketContainer(): ServletServerContainerFactoryBean {
		val container = ServletServerContainerFactoryBean()
		container.maxTextMessageBufferSize = BUFFER_SIZE
		container.maxBinaryMessageBufferSize = BUFFER_SIZE
		return container
	}

	override fun configureMessageBroker(registry: MessageBrokerRegistry) {
		registry.setApplicationDestinationPrefixes("/app")
		registry.enableSimpleBroker("/messages")
			.setTaskScheduler(stompHeartbeatThreadBool())
	}

	override fun registerStompEndpoints(registry: StompEndpointRegistry) {
		registry.addEndpoint("$wsPrefix/foo").setAllowedOrigins("*")
	}
}
