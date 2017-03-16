import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

const Home = props => (
	<div className="container-fluid">
		<center><h3>{props.greetingMessage}</h3></center>
	</div>
);

Home.propTypes = {
	greetingMessage: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
	greetingMessage: state.home.greetingMessage
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
