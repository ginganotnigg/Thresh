import { ChuoiController } from "../../library/caychuoijs/router.i";
import { TestCreateBody, TestFilterQuery, TestUpdateBody } from "./schemas/request";
import { ManageQueryService } from "./services/manage.query.service";
import { TestIdParams } from "../../common/controller/schemas/params";
import { UserIdMeta } from "../../common/controller/schemas/meta";
import { CommandService } from "./services/command.service";
import { ManagerGuardHandler } from "../../common/controller/guards/manager.guard";

export function manageController() {
	const router = ChuoiController.router().down();

	router.endpoint().get('/tests')
		.schema({
			query: TestFilterQuery,
		}).handle(async data => {
			return await ManageQueryService.getTests(data.query);
		}).build();

	router.endpoint().get('/tests/:testId')
		.schema({
			params: TestIdParams
		}).handle(async data => {
			return await ManageQueryService.getTest(data.params.testId);
		}).build();

	router.endpoint().get('/tests/:testId/questions')
		.before(ManagerGuardHandler)
		.schema({
			params: TestIdParams
		}).handle(async data => {
			return await ManageQueryService.getQuestions(data.params.testId);
		}).build();

	router.endpoint().get('/manager/tests')
		.before(ManagerGuardHandler)
		.schema({
			query: TestFilterQuery,
			meta: UserIdMeta
		}).handle(async data => {
			return await ManageQueryService.getManagerTests(data.meta.userId, data.query);
		}).build();

	router.endpoint().post('/tests')
		.before(ManagerGuardHandler)
		.schema({
			body: TestCreateBody,
			meta: UserIdMeta
		}).handle(async data => {
			await CommandService.createTest(data.meta.userId, data.body);
			return { message: "Test created" };
		}).build();

	router.endpoint().put('/tests/:testId')
		.before(ManagerGuardHandler)
		.schema({
			params: TestIdParams,
			body: TestUpdateBody
		}).handle(async data => {
			await CommandService.updateTest(data.params.testId, data.body);
			return { message: "Test updated" };
		}).build();

	router.endpoint().delete('/tests/:testId')
		.before(ManagerGuardHandler)
		.schema({
			params: TestIdParams
		}).handle(async data => {
			await CommandService.deleteTest(data.params.testId);
			return { message: "Test deleted" };
		}).build();
}