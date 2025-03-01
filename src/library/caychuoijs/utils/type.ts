import { NextFunction, Request, Response } from "express";
import { z, ZodRawShape } from "zod";

export type Constructor<T = any> = new (...args: any[]) => T;

export type CallbackDataHandler<
	TParams extends Record<string, any> = Record<string, any>,
	TQuery extends Record<string, any> = Record<string, any>,
	TBody extends Record<string, any> = Record<string, any>,
	THeaders extends Record<string, any> = Record<string, any>,
	TMeta extends Record<string, any> | null = Record<string, any> | null,
	TResponse extends Record<string, any> | void = void,
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

export type RequestSchema<
	TParams extends Record<string, any>,
	TQuery extends Record<string, any>,
	TBody extends Record<string, any>,
	THeader extends Record<string, any>,
	TMeta extends Record<string, any>,
> = {
	params?: z.ZodObject<any, any, any, TParams>;
	query?: z.ZodObject<any, any, any, TQuery>;
	body?: z.ZodObject<any, any, any, TBody>;
	headers?: z.ZodObject<any, any, any, THeader>;
	meta?: z.ZodObject<any, any, any, TMeta>;
};
