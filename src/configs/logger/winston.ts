import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

const customFormat = printf(({ level, message, timestamp }) => {
	return `${timestamp} - [${level}]: ${message}`;
});

const logger = createLogger({
	level: 'info',
	format: combine(
		colorize(),
		timestamp(),
		customFormat
	),
	transports: [
		new transports.Console(),
		new transports.File({ filename: 'logs/error.log', level: 'error' }),
		new transports.File({ filename: 'logs/combined.log' }),
		new transports.File({ filename: 'logs/req.log', level: 'info' }),
		new transports.File({ filename: 'logs/sql.log', level: 'info' })
	],
});

export const logHttpRequest = (message: string, meta?: any) => {
	logger.log({
		level: 'info',
		message,
		...meta,
		transport: 'req'
	});
};

export const logSqlCommand = (message: string, meta?: any) => {
	logger.log({
		level: 'info',
		message,
		...meta,
		transport: 'sql'
	});
};

export default logger;