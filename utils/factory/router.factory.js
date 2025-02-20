// @ts-check
const express = require('express');

/**
 * @typedef {import('express').Router} Router
 * @typedef {import('express').Request} Request
 * @typedef {import('express').Response} Response
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * Express route handler function type.
 * @callback ExpressHandler
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @param {import("express").NextFunction} next - Express next function.
 */

/**
 * @param {ExpressHandler} controller - Controller function to be executed
 */
function tryCatch(controller) {
	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 */
	return async (req, res, next) => {
		try {
			return await controller(req, res, next);
		} catch (error) {
			return next(error);
		}
	}
}


/**
 * Add try-catch block to routers.
 * @param {Router} router 
 * @param {string} path 
 * @param {"get" | "post" | "put" | "delete"} method
 * @param {ExpressHandler} controller 
 */
function tryCatchRouterWarpper(router, method, path, controller) {
	return router[method](path, tryCatch(controller));
}

/**
 * Creates child router with path and returns it.
 * @param {Router} router 
 * @param {string | undefined} path 
 */
function childRouterFactory(router, path) {
	const childRouter = express.Router();
	if (!path) {
		router.use(childRouter);
		return childRouter;
	}
	router.use(path, childRouter);
	return childRouter;
}

module.exports = {
	tryCatchRouterWarpper,
	childRouterFactory
};