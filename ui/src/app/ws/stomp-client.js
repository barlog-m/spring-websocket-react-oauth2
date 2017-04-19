import webstomp from "webstomp-client";

import {backoff} from "../utils/backoff";
import * as connectionState from "./connection-state";
import * as dataTypes from "./stomp-data-types";

class StompClient {
	constructor(onDataReceivedCallback,
				onConnected,
				onDisconnected,
				onConnectionInProgress) {
		this.onDataReceivedCallback = onDataReceivedCallback;
		this.onConnectionInProgress = onConnectionInProgress;
		this.onConnected = onConnected;
		this.onDisconnected = onDisconnected;

		console.debug("StompClient: ws config");

		this.options = {
			debug: false,
			protocols: webstomp.VERSIONS.supportedProtocols()
		};

		this.getConnectionPromise.bind(this);
		this.disconnectStomp.bind(this);

		this.connection = connectionState.LOST;
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
				console.debug(`StompClient: all reconnect attempts ended with error: ${err}`);
				this.onDisconnected();
			});
	}

	disconnectStomp() {
		if (this.client) {
			this.client.disconnect(() => {
				console.debug("StompClient: disconnected");
				this.resetConnectionState();
			});
		}
	}

	resetConnectionState() {
		this.connection = connectionState.LOST;
		this.onDisconnected();
	}

	getConnectionPromise() {
		return new Promise((resolve, reject) => {
			console.debug("StompClient: ws connect begin");
			this.connection = connectionState.IN_PROGRESS;

			this.prepareUrl();
			this.client = webstomp.over(new WebSocket(this.url), this.options);

			this.client.connect({}, (user) => {
				console.debug("StompClient: stomp connected", user);
				this.connection = connectionState.ESTABLISHED;
				resolve();
				this.subscribe();
			}, (err) => {
				console.error("StompClient: stomp error", err);
				console.debug("StompClient: connection state", this.connection);
				if (this.connection === connectionState.ESTABLISHED) {
					this.onDisconnected();
				} else {
					reject(err);
				}
			});
		});
	}

	subscribe() {
		this.client.subscribe("/messages", data => {
			const message = JSON.parse(data.body);
			this.onDataReceivedCallback([dataTypes.MESSAGE, message]);
			console.debug("StompClient: stomp message received", message);
		});
	}

	prepareUrl() {
		console.debug("StompClient: prepare url with token", this.token);
		console.debug("StompClient: prepare url for host", this.host);

		const ws =  (process.env.NODE_ENV === "development") ? "ws" : "wss";
		this.url = `${ws}://${this.host}/ws/v1/deals?access_token=${this.token}`;

		console.debug("StompClient: url", this.url);
	}
}

export default StompClient;
