import { Chuoi } from "../../library/caychuoijs";
import { TestCreateBodySchema, TestFilterQuerySchema, TestUpdateBodySchema } from "./schemas/request";
import { ManageQueryService } from "./services/manage.query.service";
import { TestIdParamsSchema } from "../../common/controller/schemas/params";
import { CommandService } from "./services/command.service";
import { ManagerGuardHandler } from "../../common/controller/guards/manager.guard";
import { UserIdMetaSchema } from "../../common/controller/schemas/meta";

export function manageController() {
	const router = Chuoi.newRoute();

	router.endpoint().get('/tests')
		.schema({
			query: TestFilterQuerySchema,
		}).handle(async data => {
			return await ManageQueryService.getTests(data.query);
		}).build();

	router.endpoint().get('/tests/:testId')
		.schema({
			params: TestIdParamsSchema
		}).handle(async data => {
			return await ManageQueryService.getTest(data.params.testId);
		}).build();

	router.endpoint().get('/tests/:testId/questions')
		.before(ManagerGuardHandler)
		.schema({
			params: TestIdParamsSchema
		}).handle(async data => {
			return await ManageQueryService.getQuestions(data.params.testId);
		}).build();

	router.endpoint().get('/manager/tests')
		.before(ManagerGuardHandler)
		.schema({
			query: TestFilterQuerySchema,
			meta: UserIdMetaSchema
		}).handle(async data => {
			return await ManageQueryService.getManagerTests(data.meta.userId, data.query);
		}).build();

	router.endpoint().post('/tests')
		.before(ManagerGuardHandler)
		.schema({
			body: TestCreateBodySchema,
			meta: UserIdMetaSchema
		}).handle(async data => {
			await CommandService.createTest(data.meta.userId, data.body);
			return { message: "Test created" };
		}).build();

	router.endpoint().put('/tests/:testId')
		.before(ManagerGuardHandler)
		.schema({
			params: TestIdParamsSchema,
			body: TestUpdateBodySchema,
		}).handle(async data => {
			await CommandService.updateTest(data.params.testId, data.body);
			return { message: "Test updated" };
		}).build();

	router.endpoint().delete('/tests/:testId')
		.before(ManagerGuardHandler)
		.schema({
			params: TestIdParamsSchema,
		}).handle(async data => {
			await CommandService.deleteTest(data.params.testId);
			return { message: "Test deleted" };
		}).build();
}