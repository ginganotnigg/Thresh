import { securityDocument } from "../../controller/documents/security";
import { ManagerGuardHandler } from "../../controller/guards/manager.guard";
import { UserPipe } from "../../controller/pipes/user.pipe";
import { PagedSchema } from "../../controller/schemas/base";
import { UserIdMeta } from "../../controller/schemas/meta";
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

	router.endpoint().get('/manager/tests/:testId/questions')
		.addSecurity(securityDocument, "roleId")
		.middleware(ManagerGuardHandler)
		.schema({
			params: TestIdParamsSchema,
			response: z.array(QuestionResponseSchema)
		}).handle(async data => {
			return await ManageQueryService.getQuestions(data.params.testId);
		}).build({ tags: ['Tests'], summary: 'Get all informations (include correct answer) of all questions of a test.' });

	router.endpoint().get('/manager/tests')
		.addSecurity(securityDocument, "roleId")
		.addSecurity(securityDocument, "userId")
		.addPipe(UserPipe)
		.middleware(ManagerGuardHandler)
		.schema({
			query: TestFilterQuerySchema,
			response: PagedSchema(TestItemResponseSchema)
		}).handle(async data => {
			return await ManageQueryService.getManagerTests(data.meta.userId, data.query);
		}).build({ tags: ['Tests'], summary: "Get manager's tests" });

	router.endpoint().post('/manager/tests')
		.addSecurity(securityDocument, "roleId")
		.addSecurity(securityDocument, "userId")
		.addPipe(UserPipe)
		.middleware(ManagerGuardHandler)
		.schema({
			body: TestCreateBodySchema,
			meta: UserIdMeta,
		}).handle(async data => {
			await CommandService.createTest(data.meta.userId, data.body);
			return { message: "Test created" };
		}).build({ tags: ['Tests'] });

	router.endpoint().put('/manager/tests/:testId')
		.addSecurity(securityDocument, "roleId")
		.middleware(ManagerGuardHandler)
		.schema({
			params: TestIdParamsSchema,
			body: TestUpdateBodySchema,
		}).handle(async data => {
			await CommandService.updateTest(data.params.testId, data.body);
			return { message: "Test updated" };
		}).build({ tags: ['Tests'] });

	router.endpoint().delete('/manager/tests/:testId')
		.addSecurity(securityDocument, "roleId")
		.middleware(ManagerGuardHandler)
		.schema({
			params: TestIdParamsSchema,
		}).handle(async data => {
			await CommandService.deleteTest(data.params.testId);
			return { message: "Test deleted" };
		}).build({ tags: ['Tests'] });
}