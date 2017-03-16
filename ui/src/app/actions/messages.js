import * as types from "./types";

const receive = payload => ({
	type: types.MESSAGE_RECEIVED,
	payload
});

export const addMessage = m => dispatch => dispatch(receive(m))
