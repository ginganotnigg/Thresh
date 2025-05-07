import { createLogger, format, transports } from 'winston';
import { getRequestId } from '../../controller/defaults/http-logger.middleware';
import { env } from '../env';

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	socket: 4,
	sql: 5,
	tick: 6,
	debug: 7,
};

const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	http: 'cyan',
	socket: 'cyan',
	sql: 'cyan',
	tick: 'cyan',
	debug: 'blue'
};

const { combine, timestamp, printf, colorize, align } = format;

const restCustomFormat = printf(({ level, message, timestamp, errorStack }) => {
	const requestId = getRequestId();
	return `[${requestId}] - [${timestamp}] - [${level}]: ${message} ${errorStack ? '\n' + '[Error Stack]: ' + '\n' + errorStack : ''}`;
});

const socketCustomFormat = printf(({ level, message, timestamp, errorStack }) => {
	return `[${timestamp}] - [${level}]: ${message} ${errorStack ? '\n' + '[Error Stack]: ' + '\n' + errorStack : ''}`;
});

const httpFormat = combine(
	colorize(),
	timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	align(),
	restCustomFormat
);

const normalFormat = combine(
	colorize(),
	timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	align(),
	socketCustomFormat
);

format.colorize().addColors(colors);

const logger = createLogger({
	levels,
	level: env.logLevel,
	format: httpFormat,
	transports: [
		new transports.Console({ level: 'info' }),
		new transports.File({ filename: 'logs/error.log', level: 'error', options: { flags: 'w' } }),
		new transports.File({ filename: 'logs/combined.log', options: { flags: 'w' } }),
	],
});

const httpRequestLogger = createLogger({
	level: 'info',
	format: httpFormat,
	transports: [
		new transports.File({ filename: 'logs/req.log', level: 'info', options: { flags: 'w' } })
	]
});

const httpResponseLogger = createLogger({
	level: 'info',
	format: httpFormat,
	transports: [
		new transports.File({ filename: 'logs/res.log', level: 'info', options: { flags: 'w' } })
	]
});

const sqlLogger = createLogger({
	level: 'info',
	format: httpFormat,
	transports: [
		new transports.File({ filename: 'logs/sql.log', level: 'info', options: { flags: 'w' } })
	]
});

const socketLogger = createLogger({
	levels,
	level: 'info',
	format: normalFormat,
	transports: [
		new transports.File({ filename: 'logs/socket.log', level: 'info', options: { flags: 'w' } })
	]
});

const tickLogger = createLogger({
	levels,
	level: 'error',
	format: normalFormat,
	transports: [
		new transports.File({ filename: 'logs/tick.log', level: 'error', options: { flags: 'w' } })
	]
});

export const logHttpRequest = (message: string, meta?: any) => {
	httpRequestLogger.info(message, meta);
	logger.log('info', message, meta);
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
	socketLogger.info(message, { ...meta });
	logger.log('socket', message, meta);
}

export const logTickError = (error: Error | unknown, meta?: any) => {
	let message;
	let errorStack;
	if (error instanceof Error) {
		message = error.message;
		errorStack = error.stack || '';
	} else {
		message = 'Unknown error';
		errorStack = JSON.stringify(error);
	}
	tickLogger.error({ message, errorStack, ...meta });
	logger.log('error', { message, errorStack, ...meta });
}

export default logger;