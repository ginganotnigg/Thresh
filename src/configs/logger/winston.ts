import { createLogger, format, transports } from 'winston';
import { getRequestId } from '../../common/controller/defaults/http-logger.middleware';

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	socket: 3,
	sql: 3,
	debug: 5
};

const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	http: 'cyan',
	socket: 'orange',
	sql: 'magenta',
	debug: 'blue'
};

const { combine, timestamp, printf, colorize, align } = format;

const restCustomFormat = printf(({ level, message, timestamp }) => {
	const requestId = getRequestId();
	return `[${requestId}] - [${timestamp}] - [${level}]: ${message}`;
});

const socketCustomFormat = printf(({ level, message, timestamp }) => {
	return `[${timestamp}] - [${level}]: ${message}`;
});

const restFormat = combine(
	colorize(),
	timestamp(),
	align(),
	restCustomFormat
);

const socketFormat = combine(
	colorize(),
	timestamp(),
	align(),
	socketCustomFormat
);

format.colorize().addColors(colors);

const logger = createLogger({
	levels,
	level: 'http',
	format: restFormat,
	transports: [
		new transports.Console(),
		new transports.File({ filename: 'logs/error.log', level: 'error' }),
		new transports.File({ filename: 'logs/combined.log' }),
	],
});

const httpRequestLogger = createLogger({
	level: 'info',
	format: restFormat,
	transports: [
		new transports.File({ filename: 'logs/req.log', level: 'info' })
	]
});

const httpResponseLogger = createLogger({
	level: 'info',
	format: restFormat,
	transports: [
		new transports.File({ filename: 'logs/res.log', level: 'info' })
	]
});

const sqlLogger = createLogger({
	level: 'info',
	format: restFormat,
	transports: [
		new transports.File({ filename: 'logs/sql.log', level: 'info' })
	]
});

const socketLogger = createLogger({
	level: 'info',
	format: socketFormat,
	transports: [
		new transports.File({ filename: 'logs/socket.log', level: 'info' })
	]
});

export const logHttpRequest = (message: string, meta?: any) => {
	httpRequestLogger.info(message, meta);
	logger.log('http', message, meta);
};

export const logHttpResponse = (message: string, meta?: any) => {
	httpResponseLogger.info(message, meta);
	logger.log('http', message, meta);
}

export const logSqlCommand = (message: string, meta?: any) => {
	sqlLogger.info(message, meta);
	logger.log('sql', message, meta);
};

export const logSocket = (message: string, meta?: any) => {
	socketLogger.info(message, meta);
	logger.log('socket', message, meta);
}

export default logger;