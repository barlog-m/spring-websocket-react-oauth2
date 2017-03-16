package li.barlog.app.settings

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.stereotype.Component

@Component
@ConfigurationProperties(prefix = "authentication")
class AuthenticationSettings {
	lateinit var key: String
	var accessTokenValiditySeconds: Int = 0
	var refreshTokenValiditySeconds: Int = 0
}
