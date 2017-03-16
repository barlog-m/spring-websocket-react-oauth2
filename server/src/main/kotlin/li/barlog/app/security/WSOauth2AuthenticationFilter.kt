package li.barlog.app.security

import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.provider.token.DefaultTokenServices
import org.springframework.web.filter.OncePerRequestFilter
import javax.servlet.FilterChain
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

class WSOauth2AuthenticationFilter(
	private val tokenServices: DefaultTokenServices
) : OncePerRequestFilter() {
	override fun doFilterInternal(req: HttpServletRequest,
								  res: HttpServletResponse,
								  chain: FilterChain) {
		val data = req.parameterMap["token"]
		if (data != null && data.isNotEmpty()) {
			val token = data[0]

			try {
				val authentication = tokenServices.loadAuthentication(token)
				SecurityContextHolder.getContext().authentication = authentication
			} catch (e: Exception) {
				logger.trace("${e.message}")
			}
		}

		chain.doFilter(req, res)
	}
}
