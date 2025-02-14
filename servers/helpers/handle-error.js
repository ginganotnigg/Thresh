const socketErrorHandler = (handler) => {
	const handleError = (err) => {
		// handle error here
	};

	return (...args) => {
		try {
			const ret = handler.apply(this, args);
			if (ret && typeof ret.catch === "function") {
				// async handler
				ret.catch(handleError);
			}
		} catch (e) {
			// sync handler
			handleError(e);
		}
	};
};


module.exports = {
	socketErrorHandler
}