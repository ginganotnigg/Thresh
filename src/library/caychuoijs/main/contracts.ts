import { Request, Response, NextFunction } from "express"
import { Constructor } from "../utils/type";

export abstract class ChuoiPipeBase<TMeta extends object = {}> implements IChuoiMiddleware {
	abstract extract(req: Request): TMeta;

	handle(req: Request, res: Response, next: NextFunction): void {
		const meta = this.extract(req);
		(req as any).meta = meta;
		next();
	}
}

export abstract class ChuoiGuardBase implements IChuoiMiddleware {
	abstract check(req: Request, next: NextFunction): void;

	handle(req: Request, res: Response, next: NextFunction): void {
		this.check(req, next);
		next();
	}
}

export interface IChuoiMiddleware {
	handle(req: Request, res: Response, next: NextFunction): void;
}

export interface IChuoiExceptionHandler {
	handle(err: any, req: Request, res: Response, next: NextFunction): void;
}

export interface ISchemaValidator {
	validate<T extends object>(obj: any, type: Constructor<T>): T;
}
