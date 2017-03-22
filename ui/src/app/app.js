import React, {PropTypes, Component} from "react";
import {connect} from "react-redux";

import Spinner from "./components/spinner";
import Error from "./containers/error";
import Menu from "./menu/menu";

import Connection from "./ws/connection";

const App = props => (
	<div>
		<Connection/>
		<Spinner visible={props.busy}/>
		<Error/>
		<Menu/>
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
