import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export type Constructor<T = any> = new (...args: any[]) => T;
export type HttpMethod = "get" | "post" | "put" | "delete" | "patch" | "options" | "head" | "trace";

export type CallbackDataHandler<TParams, TQuery, TBody, THeaders, TMeta, TResponse> = (requestData: RequestData<TParams, TQuery, TBody, THeaders, TMeta>) => TResponse | Promise<TResponse> | any;

export type CallbackExpressHandler = (req: Request, res: Response, next: NextFunction) => void;

export type RequestData<TParams, TQuery, TBody, THeaders, TMeta> = {
	params: TParams;
	query: TQuery;
	body: TBody;
	headers: THeaders;
	meta: TMeta;
};

export type MetaRequest<T extends Record<string, any> = Record<string, any>> = Request & { meta: T };

export type RequestSchema<
	TParams,
	TQuery,
	TBody,
	THeader,
	TMeta,
> = {
	params?: z.ZodObject<any, any, any, TParams>;
	query?: z.ZodObject<any, any, any, TQuery>;
	body?: z.ZodObject<any, any, any, TBody>;
	headers?: z.ZodObject<any, any, any, THeader>;
	meta?: z.ZodObject<any, any, any, TMeta>;
};

export type FullSchema<TParams, TQuery, TBody, THeaders, TMeta, TResponse> = RequestSchema<TParams, TQuery, TBody, THeaders, TMeta> & {
	response?: z.ZodType<TResponse> | z.ZodObject<any, any, any, TResponse> | z.ZodArray<z.ZodType<TResponse>>;
}