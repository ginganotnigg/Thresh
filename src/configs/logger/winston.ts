import { createLogger, format, transports } from 'winston';

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	sql: 4,
	debug: 5
};

const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	http: 'cyan',
	sql: 'magenta',
	debug: 'blue'
};

const { combine, timestamp, printf, colorize } = format;

const customFormat = printf(({ level, message, timestamp, context, requestId, metadata }) => {
	return `${timestamp} - [${level}]: ${message} ${context ? JSON.stringify(context) : ''} ${requestId ? `Request ID: ${requestId}` : ''} ${metadata ? JSON.stringify(metadata) : ''}`;
});

const baseFormat = combine(
	colorize(),
	timestamp(),
	customFormat
);

format.colorize().addColors(colors);

const logger = createLogger({
	levels,
	level: 'http',
	format: baseFormat,
	transports: [
		new transports.Console(),
		new transports.File({ filename: 'logs/error.log', level: 'error' }),
		new transports.File({ filename: 'logs/combined.log' }),
	],
});

// Transport-specific loggers
const httpLogger = createLogger({
	level: 'info',
	format: baseFormat,
	transports: [
		new transports.File({ filename: 'logs/req.log', level: 'info' })
	]
});

const sqlLogger = createLogger({
	level: 'info',
	format: baseFormat,
	transports: [
		new transports.File({ filename: 'logs/sql.log', level: 'info' })
	]
});

export const logHttpRequest = (message: string, meta?: any) => {
	httpLogger.info(message, meta);
	logger.log('http', message, meta);
};

export const logSqlCommand = (message: string, meta?: any) => {
	sqlLogger.info(message, meta);
	logger.log('sql', message, meta);
};

export default logger;