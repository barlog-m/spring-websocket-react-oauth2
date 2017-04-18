import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import Spinner from "./components/spinner";
import Error from "./containers/error";
import MainMenu from "./menu/main";

import Connection from "./ws/connection";

const App = props => (
	<div>
		<Connection/>
		<Spinner visible={props.busy}/>
		<Error/>
		<MainMenu/>
		{props.children}
	</div>
);

App.propTypes = {
	busy: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
	busy: state.global.busy
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(App);
