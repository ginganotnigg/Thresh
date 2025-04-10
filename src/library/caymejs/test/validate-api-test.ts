import { Response } from "supertest";
import { DataDriven } from "./data-driven.i";

export function validateResult<TIn extends string | Record<string, any>, TOut>(result: any | Response, data: DataDriven<TIn, TOut>) {
	if (result instanceof Response) {
		result = result.body;
	}
	expect(result).toBeDefined();
	if (data.expected != null) {
		expect(result).toEqual(data.expected);
	}
	return result;
}
