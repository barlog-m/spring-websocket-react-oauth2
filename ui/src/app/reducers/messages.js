import * as types from "../actions/types";

const initState = () => ({
	list: []
});

const messages = (state = initState(), action) => {
	switch (action.type) {
		case types.MESSAGE_RECEIVED:
			return {
				...state,
				list: [...state.list, action.payload]
			};
		default:
			return state;
	}
};

export default messages;
