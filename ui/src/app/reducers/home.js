import * as types from "../actions/types";

const intiState = () => ({
	greetingMessage: ""
})

const home = (state = intiState(), action) => {
	switch (action.type) {
		case types.GREETING_MESSAGE_RECEIVED:
			return {
				...state,
				greetingMessage: action.payload
			};
		default:
			return state;
	}
};

export default home;
