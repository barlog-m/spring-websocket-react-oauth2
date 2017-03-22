package li.barlog.app.config

import li.barlog.app.csrf.CsrfTestConfig
import li.barlog.app.oauth.AuthTestConfig
import li.barlog.app.oauth.AuthTestResourceServerConfig
import org.springframework.boot.autoconfigure.EnableAutoConfiguration
import org.springframework.context.annotation.ComponentScan
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.FilterType

@EnableAutoConfiguration
@ComponentScan(
	basePackages = arrayOf("li.barlog.app"),
	excludeFilters = arrayOf(
		ComponentScan.Filter(
			type = FilterType.ASSIGNABLE_TYPE,
			classes = arrayOf(
				ITConfig::class,
				CsrfTestConfig::class,
				AuthTestConfig::class,
				AuthTestResourceServerConfig::class
			)
		)
	)
)
@Configuration
open class AppConfig
