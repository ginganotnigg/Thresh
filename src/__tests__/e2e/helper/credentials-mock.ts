import { agent } from "supertest";
import { App } from "supertest/types";

export const requestWithCredentials = (app: App) => {
	return agent(app)
		.set('x-user-id', 1)
		.set('x-role-id', 1)
} 