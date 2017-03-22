package li.barlog.app.ws

import com.fasterxml.jackson.databind.ObjectMapper
import li.barlog.app.config.AppConfig
import li.barlog.app.oauth.createAuthUrl
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith
import org.springframework.boot.context.embedded.LocalServerPort
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.junit4.SpringRunner
import java.util.concurrent.CompletableFuture
import java.util.concurrent.TimeUnit
import org.junit.Before
import org.springframework.beans.factory.annotation.Autowired


@RunWith(SpringRunner::class)
@SpringBootTest(
	classes = arrayOf(AppConfig::class),
	webEnvironment = WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class MessagesIT {
	@Autowired
	private lateinit var mapper: ObjectMapper

	@LocalServerPort
	private lateinit var port: Integer

	private lateinit var token: String

	private val url: String
		get() = "ws://localhost:$port/ws/foo?access_token=$token"

	@Before
	fun init() {
		token = requestToken().first
	}

	@Test
	fun ok() {
		val future = connect()
		val response = future.get(10, TimeUnit.SECONDS)
		assertEquals(101, response.code())
	}

	@Test
	fun error() {
		breakToken()
		val future = connect()
		val response = future.get(10, TimeUnit.SECONDS)
		assertEquals(401, response.code())
	}

	fun connect() = run {
		val future = CompletableFuture<Response>()
		val client = OkHttpClient()

		val request = Request.Builder()
			.url(url)
			.build()

		val listener = object : WebSocketListener() {
			override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response) {
				client.dispatcher().executorService().shutdown()
				future.complete(response)
			}

			override fun onOpen(webSocket: WebSocket, response: Response) {
				client.dispatcher().executorService().shutdown()
				future.complete(response)
			}
		}
		client.newWebSocket(request, listener)
		future
	}

	private fun requestToken(): Pair<String, String> {
		val client = OkHttpClient()
		val uri = createAuthUrl(port.toInt(), "user", "password")
		val request = Request.Builder()
			.url(uri.toURL())
			.post(RequestBody.create(null, byteArrayOf()))
			.build()
		val response = client.newCall(request).execute()

		val tokenMap = mapper.readValue(response.body().string(), Map::class.java)
		val access_token = tokenMap["access_token"].toString()
		val refresh_token = tokenMap["refresh_token"].toString()
		return Pair(access_token, refresh_token)
	}

	private fun breakToken() {
		val array = token.toCharArray()
		val brokenChar = array[token.lastIndex - 1] + 1 % 64
		array[token.lastIndex - 1] = brokenChar
		token = String(array)
	}
}
