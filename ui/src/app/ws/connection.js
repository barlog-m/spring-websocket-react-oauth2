import React, {Component} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import ConnectionCheckWorker from "worker-loader?name=js/connection-check.[hash].js!./worker-connection-check.js";
import StompMessagesWorker from "worker-loader?name=js/stomp-messages.[hash].js!./worker-stomp-messages.js";
import * as connectionActions from "../actions/connection";
import * as messagesActions from "../actions/messages";
import * as authActions from "../actions/auth";
import * as stompMessageTypes from "./stomp-message-types";
import * as dataTypes from "./stomp-data-types";
import * as tokenUtils from "../token";

import * as connectionState from "./connection-state";

class Connection extends Component {
	constructor(props) {
		super(props);
		console.debug("Connection->ctor");

		this.initConnectionCheckWorker();
		this.initMessagesWorker();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.isAuthenticated !== nextProps.isAuthenticated) {
			if (nextProps.isAuthenticated) {
				this.connect();
			} else {
				this.disconnect();
			}
		}
	}

	initConnectionCheckWorker() {
		console.debug("Connection->initConnectionCheckWorker");
		this.connectionCheckWorker = new ConnectionCheckWorker();
		this.connectionCheckWorker.onmessage = this.onConnectionCheckWorker.bind(this);
	}

	initMessagesWorker() {
		console.debug("Connection->initMessagesWorker");
		this.messagesWorker = new StompMessagesWorker();
		this.messagesWorker.onmessage = this.onMessagesWorkerMessage.bind(this);
		this.onConnectionCheckWorker();
	}

	onConnectionCheckWorker() {
		console.debug("Connection->onConnectionCheckWorker: connection state", this.props.connection);
		console.debug("Connection->onConnectionCheckWorker: isAuthenticated", this.props.isAuthenticated);
		if (this.props.connection === connectionState.LOST &&
			this.props.isAuthenticated) {
			this.connect();
		}
	}

	onMessagesWorkerMessage(e) {
		console.debug("Connection->onMessagesWorkerMessage: type", e.data[0]);
		switch (e.data[0]) {
			case stompMessageTypes.DATA:
				this.processData(e.data[1]);
				break;
			case stompMessageTypes.CONNECTION_IN_PROGRESS:
				this.props.setConnectionInProgress();
				break;
			case stompMessageTypes.CONNECTED:
				this.props.setConnectionEstablished();
				break;
			case stompMessageTypes.DISCONNECTED:
				this.props.setConnectionLost();
				break;
		}
	}

	processData(data) {
		switch (data[0]) {
			case dataTypes.MESSAGE:
				console.debug("Connection->processData message", data[1]);
				this.props.addMessage(data[1]);
				break;
		}
	}

	connect() {
		console.debug("Connection->connect");
		tokenUtils.validateToken()
			.then(access_token => {
				console.debug("Connection->connect: token refreshed");
				this.messagesWorker.postMessage(
					[stompMessageTypes.CONNECT, window.location.host, access_token]);
			})
			.catch(error => {
				console.debug("Connection->connect: error", error);
				this.props.logOut();
			});
	}

	disconnect() {
		console.debug("Connection->disconnect");
		this.messagesWorker.postMessage([stompMessageTypes.DISCONNECT]);
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
	addMessage: (r) => dispatch(messagesActions.addMessage(r)),
	logOut: () => dispatch(authActions.doLogOut())
});

export default connect(mapStateToProps, mapDispatchToProps)(Connection);
