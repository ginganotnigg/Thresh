import { NextFunction, Request, Response } from "express";

export abstract class MiddlewareBase {
	abstract handle: (req: Request, res: Response, next: NextFunction) => void;
}
