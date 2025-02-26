import { Request, Response, NextFunction } from 'express';
import { ErrorResponseBase, ErrorResponseCodes } from '../../errors/error-response.base';
import logger from '../../../../configs/logger/winston';

export class ErrorHandlerMiddleware {
	handle(err: any, req: Request, res: Response, next: NextFunction) {
		const errorRes = {
			stack: process.env.NODE_ENV === 'production' ? null : err.stack ?? undefined,
			httpCode: 500,
			message: 'Internal Server Error',
			code: ErrorResponseCodes.INTERNAL_SERVER_ERROR,
			context: err,
			links: [''],
			timestamp: err.timestamp,
		}

		// Known error
		if (err instanceof ErrorResponseBase) {
			errorRes.httpCode = err.httpCode;
			errorRes.message = err.message;
			errorRes.code = err.code;
			errorRes.context = err.context;
			errorRes.links = err.links;
			errorRes.timestamp = err.timestamp;
		}

		logger.error(`[${req.method}] ${req.originalUrl} - ${errorRes.httpCode} - ${errorRes.message}`);
		logger.error(errorRes.stack);

		return res.status(errorRes.httpCode).json(errorRes);
	}
}
