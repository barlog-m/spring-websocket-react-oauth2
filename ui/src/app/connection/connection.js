import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";

import ConnectionCheckWorker from "worker-loader!../workers/connection-check.js";
import MessagesWorker from "worker-loader!../workers/messages.js";
import * as connectionActions from "../actions/connection";
import * as messagesActions from "../actions/messages";
import * as workerMessageType from "../workers/types";

import * as connectionState from "./state";

class Connection extends Component {
	constructor(props) {
		super(props);

		this.initConnectionCheckWorker();
		this.initMessagesWorker();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.isAuthenticated !== nextProps.isAuthenticated &&
			!nextProps.isAuthenticated) {
			this.disconnect();
		}
	}

	initConnectionCheckWorker() {
		this.connectionCheckWorker = new ConnectionCheckWorker();
		this.connectionCheckWorker.onmessage = this.onConnectionCheckWorker.bind(this);
	}

	initMessagesWorker() {
		this.messagesWorker = new MessagesWorker();
		this.messagesWorker.onmessage = this.onMessagesWorkerMessage.bind(this);
		this.onConnectionCheckWorker();
	}

	onConnectionCheckWorker() {
		console.debug("check connection", this.props.connection, this.props.isAuthenticated);
		if (this.props.connection === connectionState.LOST &&
			this.props.isAuthenticated) {
			this.connect();
		}
	}

	onMessagesWorkerMessage(e) {
		console.debug("App->onMessagesWorkerMessage: type", e.data[0]);
		switch (e.data[0]) {
			case workerMessageType.MESSAGE:
				this.props.addMessage(e.data[1]);
				break;
			case workerMessageType.CONNECTION_IN_PROGRESS:
				this.props.setConnectionInProgress();
				break;
			case workerMessageType.CONNECTED:
				this.props.setConnectionEstablished();
				break;
			case workerMessageType.DISCONNECTED:
				this.props.setConnectionLost();
				break;
		}
	}

	connect() {
		const token = localStorage.getItem("access_token");
		this.messagesWorker.postMessage([workerMessageType.CONNECT, token]);
	}

	disconnect() {
		this.messagesWorker.postMessage([workerMessageType.DISCONNECT]);
	}

	render() {
		return null;
	}
}

Connection.propTypes = {
	connection: PropTypes.string.isRequired,
	setConnectionInProgress: PropTypes.func.isRequired,
	setConnectionEstablished: PropTypes.func.isRequired,
	setConnectionLost: PropTypes.func.isRequired,
	addMessage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	connection: state.connection,
	isAuthenticated: state.user.isAuthenticated
});

const mapDispatchToProps = dispatch => ({
	setConnectionInProgress: () => dispatch(connectionActions.connectionInProgress()),
	setConnectionEstablished: () => dispatch(connectionActions.connectionEstablished()),
	setConnectionLost: () => dispatch(connectionActions.connectionLost()),
	addMessage: (r) => dispatch(messagesActions.addMessage(r))
});

export default connect(mapStateToProps, mapDispatchToProps)(Connection);
