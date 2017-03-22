import webstomp from "webstomp-client";

import {backoff} from "../utils/backoff";
import * as state from "../ws/state";

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

		this.options = {
			debug: false,
			protocols: webstomp.VERSIONS.supportedProtocols()
		};

		this.getConnectionPromise.bind(this);
		this.disconnectStomp.bind(this);

		this.connection = state.LOST;
	}

	connect(host, access_token) {
		this.onConnectionInProgress();
		this.host = host;
		this.token = access_token;

		backoff(
			() => this.getConnectionPromise(),
			{attempts: 32, minDelay: 1000, maxDelay: 20000})
			.then(() => this.onConnected())
			.catch((err) => {
				console.log(`MessagesReceiver: all reconnect attempts ended with error: ${err}`);
				this.onDisconnected();
			});
	}

	disconnectStomp() {
		if (this.client) {
			this.client.disconnect(() => {
				console.debug("MessagesReceiver: disconnected");
				this.resetConnectionState();
			});
		}
	}

	resetConnectionState() {
		this.connection = state.LOST;
		this.onDisconnected();
	}

	getConnectionPromise() {
		return new Promise((resolve, reject) => {
			console.debug("MessagesReceiver: ws connect begin");
			this.connection = state.IN_PROGRESS;

			this.prepareUrl();
			this.client = webstomp.over(new WebSocket(this.url), this.options);

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

	prepareUrl() {
		console.debug("MessagesReceiver: prepare url with token", this.token);
		console.debug("MessagesReceiver: prepare url for host", this.host);

		//this.url = `ws://localhost:8081/ws/v1/foo?access_token=${this.token}`;
		this.url = `ws://${this.host}/ws/v1/foo?access_token=${this.token}`;

		console.debug("MessagesReceiver: url", this.url);
	}
}

export default MessagesReceiver;
