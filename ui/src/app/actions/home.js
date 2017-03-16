import * as types from "./types";
import * as server from "./server";

const receive = payload => ({
	type: types.GREETING_MESSAGE_RECEIVED,
	payload
});

export const getGreetingMessage = () => dispatch =>
	dispatch(server.get("/api/v1/home/greeting_message", receive));
