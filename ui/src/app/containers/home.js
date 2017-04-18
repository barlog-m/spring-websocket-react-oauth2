import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

const Home = props => (
	<div className="container-fluid">
		<div style={{textAlign: "center"}}>
			<h3>{props.greetingMessage}</h3>
		</div>
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
