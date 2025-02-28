import { NextFunction, Request, Response } from "express";

export type Constructor<T = any> = new (...args: any[]) => T;

export type CallbackDataHandler<
	TParams extends Record<string, any> = Record<string, any>,
	TQuery extends Record<string, any> = Record<string, any>,
	TBody extends Record<string, any> = Record<string, any>,
	THeaders extends Record<string, any> = Record<string, any>,
	TMeta extends Record<string, any> | null = Record<string, any> | null,
	TResponse extends Record<string, any> = Record<string, any>,
> = (requestData: RequestData<TParams, TQuery, TBody, THeaders, TMeta>) => TResponse;

export type CallbackExpressHandler = (req: Request, res: Response, next: NextFunction) => void;

export type RequestData<
	TParams extends Record<string, any> = Record<string, any>,
	TQuery extends Record<string, any> = Record<string, any>,
	TBody extends Record<string, any> = Record<string, any>,
	THeaders extends Record<string, any> = Record<string, any>,
	TMeta extends Record<string, any> | null = Record<string, any> | null,
> = {
	params: TParams;
	query: TQuery;
	body: TBody;
	headers: THeaders;
	meta: TMeta;
};

export type MetaRequest<T extends Record<string, any> = Record<string, any>> = Request & { meta: T };
