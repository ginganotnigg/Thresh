import { Request, Response, NextFunction } from "express"
import { CallbackExpressHandler, Constructor, RequestData } from "./utils/type";

export interface IChuoiHandler {
	get handle(): CallbackExpressHandler;
}

export interface IChuoiExceptionHandler {
	handle(err: any, req: Request, res: Response, next: NextFunction): void;
}

export abstract class ChuoiExceptionFinalBase implements IChuoiExceptionHandler {
	handle(err: any, req: Request, res: Response, next: NextFunction): void {
		this.final(err, req, res);
		return;
	}
	abstract final(err: any, req: Request, res: Response): void;
}

export interface ISchemaValidator {
	validate<T extends object>(obj: any, type: Constructor<T>): T;
}
