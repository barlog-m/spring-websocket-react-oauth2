import MessagesReceiver from "../stomp/messages-receiver";
import * as types from "./types";

const onMessageReceived = message => {
	console.debug("MessagesWorker->onMessageReceived");
	postMessage([types.MESSAGE, message]);
};

const onConnectionInProgress = () => {
	console.debug("MessagesWorker->onConnectionInProgress");
	postMessage([types.CONNECTION_IN_PROGRESS]);
};

const onConnected = () => {
	console.debug("MessagesWorker->onConnected");
	postMessage([types.CONNECTED]);
};

const onDisconnected = () => {
	console.debug("MessagesWorker->onDisconnected");
	postMessage([types.DISCONNECTED]);
};

const messagesReceiver = new MessagesReceiver(
	onMessageReceived,
	onConnected,
	onDisconnected,
	onConnectionInProgress
);

onmessage = (e) => {
	console.debug("MessagesWorker->onMessage", e);
	console.debug("MessagesWorker:", e.data[0]);
	switch (e.data[0]) {
		case types.CONNECT:
			messagesReceiver.connect(e.data[1], e.data[2]);
			break;
		case types.DISCONNECT:
			messagesReceiver.disconnectStomp();
			break;
	}
};
