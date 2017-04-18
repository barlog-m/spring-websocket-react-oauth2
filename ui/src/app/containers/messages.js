import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

import MessageRow from "../components/message/row";

const Messages = props => (
	<div className="container">
		<table className="table table-striped">
			<thead>
			<tr>
				<th className="col-sm-9">Message</th>
			</tr>
			</thead>
			<tbody>
			{
				props.messages.map((m, i) => (
					<MessageRow key={i} data={m.data}/>
				))
			}
			</tbody>
		</table>
	</div>
);

Messages.propTypes = {
	messages: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
	messages: state.messages.list
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
