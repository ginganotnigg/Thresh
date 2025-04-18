import { securityDocument } from "../../controller/documents/security";
import { ManagerGuard } from "../../controller/guards/manager.guard";
import { UserPipe } from "../../controller/pipes/user.pipe";
import { PagedSchema } from "../../controller/schemas/base";
import { UserIdMeta } from "../../controller/schemas/meta";
import { TestIdParamsSchema } from "../../controller/schemas/params";
import { Chuoi } from "../../library/caychuoijs";
import { TestCreateBodySchema, TestFilterQuerySchema, TestUpdateBodySchema } from "./schemas/request";
import { TestItemResponseSchema, TestResponseSchema, QuestionResponseSchema } from "./schemas/response";
import { ManageCommandService } from "./services/manage.command.service";
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
		}).build({ tags: ['Manage'] });

	router.endpoint().get('/tests/challenge-of-the-day')
		.schema({
			response: TestResponseSchema
		}).handle(async () => {
			return await ManageQueryService.getChallengeOfTheDay();
		}).build({ tags: ['Manage'], summary: 'Get one Test that is the challenge of the day (current is random by day)' });

	router.endpoint().get('/tests/:testId')
		.schema({
			params: TestIdParamsSchema,
			response: TestResponseSchema
		}).handle(async data => {
			return await ManageQueryService.getTest(data.params.testId);
		}).build({ tags: ['Manage'] });

	router.endpoint().get('/manager/tests/:testId/questions')
		.addSecurityDocument(securityDocument, "roleId")
		.addGuard(ManagerGuard)
		.schema({
			params: TestIdParamsSchema,
			response: z.array(QuestionResponseSchema)
		}).handle(async data => {
			return await ManageQueryService.getQuestions(data.params.testId);
		}).build({ tags: ['Manage'], summary: 'Get all informations (include correct answer) of all questions of a test.' });

	router.endpoint().get('/manager/tests')
		.addSecurityDocument(securityDocument, "roleId")
		.addSecurityDocument(securityDocument, "userId")
		.addGuard(ManagerGuard)
		.addPipe(UserPipe)
		.schema({
			query: TestFilterQuerySchema,
			response: PagedSchema(TestItemResponseSchema)
		}).handle(async data => {
			return await ManageQueryService.getManagerTests(data.meta.userId, data.query);
		}).build({ tags: ['Manage'], summary: "Get manager's tests" });

	router.endpoint().post('/manager/tests')
		.addSecurityDocument(securityDocument, "roleId")
		.addSecurityDocument(securityDocument, "userId")
		.addGuard(ManagerGuard)
		.addPipe(UserPipe)
		.schema({
			body: TestCreateBodySchema,
			meta: UserIdMeta,
		}).handle(async data => {
			await ManageCommandService.createTest(data.meta.userId, data.body);
			return { message: "Test created" };
		}).build({ tags: ['Manage'] });

	router.endpoint().put('/manager/tests/:testId')
		.addSecurityDocument(securityDocument, "roleId")
		.addGuard(ManagerGuard)
		.schema({
			params: TestIdParamsSchema,
			body: TestUpdateBodySchema,
		}).handle(async data => {
			await ManageCommandService.updateTest(data.params.testId, data.body);
			return { message: "Test updated" };
		}).build({ tags: ['Manage'] });

	router.endpoint().delete('/manager/tests/:testId')
		.addSecurityDocument(securityDocument, "roleId")
		.addGuard(ManagerGuard)
		.schema({
			params: TestIdParamsSchema,
		}).handle(async data => {
			await ManageCommandService.deleteTest(data.params.testId);
			return { message: "Test deleted" };
		}).build({ tags: ['Manage'] });
}