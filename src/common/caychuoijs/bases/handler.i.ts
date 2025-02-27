import { NextFunction, Request, Response, Router } from "express";
import { UnauthorizedErrorResponse } from "../../controller/errors/unauthorized.error";

enum ChuoiHandlerType {
	MIDDLEWARE = 1,
	GUARD = 2,
	INTERCEPTOR = 3,
	PIPE = 4,
	ENDPOINT = 5,
	EXCEPTION_FILTER = 6,
	INTERCEPTOR_FILTER = 7,
}

export interface IChuoiHandler {
	getType(): ChuoiHandlerType;
	handle(req: Request, res: Response, next: NextFunction): void;
}

export abstract class ChuoiMiddlewareBase implements IChuoiHandler {
	getType(): ChuoiHandlerType {
		return ChuoiHandlerType.MIDDLEWARE;
	}

	handle(req: Request, res: Response, next: NextFunction): void {
		this.handleMiddleware(req, res, next);
	}

	protected abstract handleMiddleware(req: Request, res: Response, next: NextFunction): void;
}

export abstract class ChuoiGuardBase implements IChuoiHandler {
	getType(): ChuoiHandlerType {
		return ChuoiHandlerType.GUARD;
	}

	handle(req: Request, res: Response, next: NextFunction): void {
		const isValid = this.isValidRequest(req);
		if (isValid) {
			next();
		} else {
			throw new UnauthorizedErrorResponse();
		}
	}

	protected abstract isValidRequest(req: Request): boolean;
}

export abstract class ChuoiInterceptorBase implements IChuoiHandler {
	getType(): ChuoiHandlerType {
		return ChuoiHandlerType.INTERCEPTOR;
	}

	handle(req: Request, res: Response, next: NextFunction): void {
		this.handleInterceptor(req, res);
		next();
	}

	protected abstract handleInterceptor(req: Request, res: Response): void;
}

export abstract class ChuoiPipeBase implements IChuoiHandler {
	getType(): ChuoiHandlerType {
		return ChuoiHandlerType.PIPE;
	}

	handle(req: Request, res: Response, next: NextFunction): void {
		this.handlePipe(req);
		next();
	}

	protected abstract handlePipe(req: Request): void;
}

export abstract class ChuoiEndpointBase implements IChuoiHandler {
	getType(): ChuoiHandlerType {
		return ChuoiHandlerType.ENDPOINT;
	}

	handle(req: Request, res: Response, next: NextFunction): void {
		this.handleEndpoint(req, res, next);
	}

	protected abstract handleEndpoint(req: Request, res: Response, next: NextFunction): void;
}

export abstract class ChuoiExceptionBase implements IChuoiHandler {
	getType(): ChuoiHandlerType {
		return ChuoiHandlerType.EXCEPTION_FILTER;
	}

	handle(req: Request, res: Response, next: NextFunction): void {
		this.handleException(req, res, next);
	}

	protected abstract handleException(req: Request, res: Response, next: NextFunction): void;
}
