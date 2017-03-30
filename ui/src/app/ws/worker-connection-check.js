import * as connectionSettings from "../config/connection";

setInterval(() => {
	postMessage([]);
}, connectionSettings.CONNECTION_CHECK_PERIOD);
