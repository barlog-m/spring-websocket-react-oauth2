import React, {PropTypes} from "react";

const MessageRow = props => (
	<tr>
		<td>{props.data}</td>
	</tr>
);

MessageRow.propTypes = {
	data: PropTypes.string.isRequired
};

export default MessageRow;
