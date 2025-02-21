import { RequestHandler } from "express";

export abstract class MiddlewareBase {
	abstract handle: RequestHandler;
}
