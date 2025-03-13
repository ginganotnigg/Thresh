import { Response } from "supertest";
import { DataDriven } from "./data-driven.i";

export function validateResponse<TIn extends string | Record<string, any>, TOut>(response: Response, data: DataDriven<TIn, TOut>) {
	expect(response.body).toBeDefined();
	if (data.expected != null) {
		expect(response.body).toEqual(data.expected);
	}
	return response;
}
