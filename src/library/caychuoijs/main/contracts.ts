import { Request, Response, NextFunction } from "express"
import { CallbackExpressHandler, Constructor } from "../utils/type";

export interface IChuoiHandler {
	get handle(): CallbackExpressHandler;
}

export interface IChuoiExceptionHandler {
	handle(err: any, req: Request, res: Response, next: NextFunction): void;
}

export interface ISchemaValidator {
	validate<T extends object>(obj: any, type: Constructor<T>): T;
}
