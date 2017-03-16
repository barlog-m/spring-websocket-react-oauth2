const delay = time => {
	console.log(`backoff delay ${time} ms`);
	return new Promise(resolve => setTimeout(resolve, time));
};

export const backoff = (promise, config) => {
	config.delay = config.hasOwnProperty("delay") ? config.delay * 2 : config.minDelay;
	config.attempts = config.attempts - 1;
	console.log("backoff config", config);

	return promise()
		.catch((err) => {
			if (config.delay > config.maxDelay || config.attempts <= 0) {
				console.log("backoff end with error");
				return Promise.reject(err);
			} else {
				console.log("backoff recursion");
				return delay(config.delay).then(() => backoff(promise, config));
			}
		});
};
