// @ts-check

/**
 * @typedef {import('express').Router} Router
 * @typedef { import('socket.io').Namespace } Namespace
 */

const restController = require('./test-process.controller.rest');
const socketController = require('./test-process.controller.socket');
const TestProcessCommand = require('./commands/command');
const TestProcessQuery = require('./queries/query');

const command = new TestProcessCommand();
const query = new TestProcessQuery();

/**
 * @param {Router} router
 * @param {Namespace} namespace
 */
function moduleLoad(router, namespace) {
	restController(router, command, query);
	socketController(namespace, command, query);
	console.log('Test Process module loaded');
}

module.exports = moduleLoad;