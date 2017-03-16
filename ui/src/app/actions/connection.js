import * as types from "./types";

export const connectionInProgress = () => ({
	type: types.CONNECTION_IN_PROGRESS
});

export const connectionEstablished = () => ({
	type: types.CONNECTION_ESTABLISHED
});

export const connectionLost = () => ({
	type: types.CONNECTION_LOST
});
