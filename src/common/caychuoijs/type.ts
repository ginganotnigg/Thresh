import { NextFunction, Request, Response } from "express";

export type Constructor<T = any> = new (...args: any[]) => T;

export type CallbackDataHandler<
	TParams extends Record<string, any>,
	TQuery extends Record<string, any>,
	TBody extends Record<string, any>,
	THeaders extends Record<string, any>,
> = (param: TParams, query: TQuery, body: TBody, header: THeaders) => void;

export type CallbackExpressHandler = (req: Request, res: Response, next: NextFunction) => void;

export type RequestData<
	TParams extends Record<string, any> = Record<string, any>,
	TQuery extends Record<string, any> = Record<string, any>,
	TBody extends Record<string, any> = Record<string, any>,
	THeaders extends Record<string, any> = Record<string, any>,
> = {
	params: TParams;
	query: TQuery;
	body: TBody;
	headers: THeaders;
};

