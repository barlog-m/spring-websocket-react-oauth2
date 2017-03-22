import * as types from "../actions/types";
import * as connectionState from "../ws/state";

const connection = (state = connectionState.LOST, action) => {
	switch (action.type) {
		case types.CONNECTION_IN_PROGRESS:
			return connectionState.IN_PROGRESS;
		case types.CONNECTION_ESTABLISHED:
			return connectionState.ESTABLISHED;
		case types.CONNECTION_LOST:
			return connectionState.LOST;
		default:
			return state;
	}
};

export default connection;
