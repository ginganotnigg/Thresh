
/**
 * @typedef  {import('express').RequestHandler} RequestHandler
 * @typedef  {import('express').Router} Router
 */

/** 
 * @param {RequestHandler} controller - Controller function to be executed
 * @returns {Function} - Returns a function that executes the controller function and catches any errors
 */
const tryCatch = (controller) => async (req, res, next) => {
	try {
		await controller(req, res);
	} catch (error) {
		return next(error);
	}
}

module.exports = tryCatch;