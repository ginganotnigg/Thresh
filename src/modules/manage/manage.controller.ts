import { ManagerGuardHandler } from "../../controller/guards/manager.guard";
import { PagedSchema } from "../../controller/schemas/base";
import { XUserIdSchema } from "../../controller/schemas/headers";
import { TestIdParamsSchema } from "../../controller/schemas/params";
import { Chuoi } from "../../library/caychuoijs";
import { TestCreateBodySchema, TestFilterQuerySchema, TestUpdateBodySchema } from "./schemas/request";
import { TestItemResponseSchema, TestResponseSchema, QuestionResponseSchema } from "./schemas/response";
import { CommandService } from "./services/command.service";
import { ManageQueryService } from "./services/manage.query.service";
import { z } from "zod";

export function manageController() {
	const router = Chuoi.newRoute();

	router.endpoint().get('/tests')
		.schema({
			query: TestFilterQuerySchema,
			response: PagedSchema(TestItemResponseSchema)
		}).handle(async data => {
			return await ManageQueryService.getTests(data.query);
		}).build({ tags: ['Tests'] });

	router.endpoint().get('/tests/:testId')
		.schema({
			params: TestIdParamsSchema,
			response: TestResponseSchema
		}).handle(async data => {
			return await ManageQueryService.getTest(data.params.testId);
		}).build({ tags: ['Tests'] });

	router.endpoint().get('/tests/:testId/questions')
		.middleware(ManagerGuardHandler)
		.schema({
			params: TestIdParamsSchema,
			response: z.array(QuestionResponseSchema)
		}).handle(async data => {
			return await ManageQueryService.getQuestions(data.params.testId);
		}).build({ tags: ['Tests'] });

	router.endpoint().get('/manager/tests')
		.middleware(ManagerGuardHandler)
		.schema({
			query: TestFilterQuerySchema,
			headers: XUserIdSchema,
			response: PagedSchema(TestItemResponseSchema)
		}).handle(async data => {
			return await ManageQueryService.getManagerTests(data.headers["x-user-id"], data.query);
		}).build({ tags: ['Tests'] });

	router.endpoint().post('/tests')
		.middleware(ManagerGuardHandler)
		.schema({
			body: TestCreateBodySchema,
			headers: XUserIdSchema,
		}).handle(async data => {
			await CommandService.createTest(data.headers["x-user-id"], data.body);
			return { message: "Test created" };
		}).build({ tags: ['Tests'] });

	router.endpoint().put('/tests/:testId')
		.middleware(ManagerGuardHandler)
		.schema({
			params: TestIdParamsSchema,
			body: TestUpdateBodySchema,
		}).handle(async data => {
			await CommandService.updateTest(data.params.testId, data.body);
			return { message: "Test updated" };
		}).build({ tags: ['Tests'] });

	router.endpoint().delete('/tests/:testId')
		.middleware(ManagerGuardHandler)
		.schema({
			params: TestIdParamsSchema,
		}).handle(async data => {
			await CommandService.deleteTest(data.params.testId);
			return { message: "Test deleted" };
		}).build({ tags: ['Tests'] });
}