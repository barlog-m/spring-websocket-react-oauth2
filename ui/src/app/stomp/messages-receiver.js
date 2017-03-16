import webstomp from "webstomp-client";
import {backoff} from "../utils/backoff";
import * as state from "../connection/state";

class MessagesReceiver {
	constructor(onMessageReceivedCallback,
				onConnected,
				onDisconnected,
				onConnectionInProgress) {
		this.onMessageReceivedCallback = onMessageReceivedCallback;
		this.onConnectionInProgress = onConnectionInProgress;
		this.onConnected = onConnected;
		this.onDisconnected = onDisconnected;

		console.debug("MessagesReceiver: ws config");

		this.url = "ws://localhost:8081/ws/foo";
		this.options = {debug: false, protocols: webstomp.VERSIONS.supportedProtocols()};

		this.getConnectionPromise.bind(this);

		this.connection = state.LOST;
	}

	connect(token) {
		this.token = token;
		this.onConnectionInProgress();
		backoff(
			() => this.getConnectionPromise(),
			{attempts: 32, minDelay: 1000, maxDelay: 20000})
			.then(() => this.onConnected())
			.catch((err) => {
				console.log(`MessagesReceiver: all reconnect attempts ended with error: ${err}`);
				this.onDisconnected();
			});
	}

	disconnect() {
		this.client.disconnect(() => {
			console.log("MessagesReceiver: disconnected");
			this.connection = state.LOST;
			this.onDisconnected();
		});
	}

	getConnectionPromise() {
		return new Promise((resolve, reject) => {
			console.debug("MessagesReceiver: ws connect begin");
			this.connection = state.IN_PROGRESS;

			console.debug("MessagesReceiver: token ", this.token);
			const url = `${this.url}?token=${this.token}`;
			console.debug("MessagesReceiver: url ", this.url);
			this.client = webstomp.over(new WebSocket(url), this.options);

			this.client.connect({}, (user) => {
				console.debug("MessagesReceiver: stomp connected", user);
				this.connection = state.ESTABLISHED;
				resolve();
				this.client.subscribe("/messages", data => {
					const message = JSON.parse(data.body);
					this.onMessageReceivedCallback(message);
					console.debug("MessagesReceiver: stomp message received", message);
				});
			}, (err) => {
				console.error("MessagesReceiver: stomp error", err);
				console.debug("MessagesReceiver: connection state", this.connection);
				if (this.connection === state.ESTABLISHED) {
					this.onDisconnected();
				} else {
					reject(err);
				}
			});
		});
	}
}

export default MessagesReceiver;
