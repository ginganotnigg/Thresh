import { z } from "zod";
import { Chuoi } from "../../../library/caychuoijs";
import { commandCreatePractice, CreatePracticeSchema } from "../command/create-practice";
import { TestIdParamsSchema } from "../../../controller/schemas/params";
import { commandDeletePractice } from "../command/delete-practice";

export default function controllerPractice() {
	const router = Chuoi.newRoute();

	router.endpoint().post('/practice-tests')
		.schema({
			body: CreatePracticeSchema,
			response: z.object({
				testId: z.string(),
			}),
		}).handle(async data => {
			return await commandCreatePractice(data.body);
		}).build({ tags: ['Practice'] });

	router.endpoint().delete('/practice-tests/:testId')
		.schema({
			params: TestIdParamsSchema,
		}).handle(async data => {
			await commandDeletePractice({ testId: data.params.testId });
		}).build({ tags: ['Practice'] });
}