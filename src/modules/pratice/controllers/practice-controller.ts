import { z } from "zod";
import { Chuoi } from "../../../library/caychuoijs";
import { commandCreatePractice, CreatePracticeSchema } from "../command/practice/create-practice";
import { TestIdParamsSchema } from "../../../controller/schemas/params";
import { commandDeletePractice } from "../command/practice/delete-practice";
import { GetPracticeTestsQuerySchema, GetPracticeTestsResponseSchema } from "../schema";
import { queryPracticeTests } from "../query/practice-tests";
import { TestPracticeInfoSchema } from "../../../domain/schema/info.schema";
import { queryPracticeTest } from "../query/practice-test";

export default function controllerPractice() {
	const router = Chuoi.newRoute();

	router.endpoint().get('/practice-tests')
		.schema({
			query: GetPracticeTestsQuerySchema,
			response: GetPracticeTestsResponseSchema,
		}).handle(async data => {
			return await queryPracticeTests(data.query);
		}).build({ tags: ['Practice'] });

	router.endpoint().get('/practice-tests/:testId')
		.schema({
			params: TestIdParamsSchema,
			response: TestPracticeInfoSchema,
		}).handle(async data => {
			return await queryPracticeTest(data.params.testId);
		}).build({ tags: ['Practice'] });

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