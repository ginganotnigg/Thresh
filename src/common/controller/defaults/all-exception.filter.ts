import { NextFunction, Request, Response } from "express";
import logger from "../../../configs/logger/winston";
import { ErrorResponseCodes, ErrorResponseBase } from "../errors/error-response.base";
import { ChuoiContainer } from "../../../library/caychuoijs/utils/container";
import { IChuoiExceptionHandler } from "../../../library/caychuoijs/main/contracts";

export class AllExceptionFilter implements IChuoiExceptionHandler {
	handle(err: any, req: Request, res: Response, next: NextFunction): void {
		const errorRes = {
			stack: process.env.NODE_ENV === 'production' ? null : err.stack ?? undefined,
			httpCode: 500,
			message: 'Internal Server Error: ' + err.message || 'Unknown error',
			code: ErrorResponseCodes.INTERNAL_SERVER_ERROR,
			context: err,
			links: [''],
			timestamp: err.timestamp,
		}

		if (err instanceof ErrorResponseBase) {
			errorRes.httpCode = err.httpCode;
			errorRes.message = err.message;
			errorRes.code = err.code;
			errorRes.context = err.context;
			errorRes.links = err.links;
			errorRes.timestamp = err.timestamp;
		}
		logger.error(`[${req.method}] ${req.originalUrl} - ${errorRes.httpCode} - ${errorRes.message}`, errorRes.stack);

		res.status(errorRes.httpCode).json(errorRes);
	}
}

ChuoiContainer.register(AllExceptionFilter);