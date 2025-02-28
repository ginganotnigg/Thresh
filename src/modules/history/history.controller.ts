import { ManagerGuardHandler } from "../../common/controller/guards/manager.guard";
import { ChuoiController } from "../../library/caychuoijs/router.i";
import { HistoryQueryService } from "./history.query.service";
import { AttemptFilterQuery } from "./schemas/request";
import { AttemptIdParams, TestIdParams } from "../../common/controller/schemas/params";

export function historyController() {
	const router = ChuoiController.router().down();

	router.endpoint().get('/tests/:testId/attempts')
		.before(ManagerGuardHandler)
		.schema({
			params: TestIdParams,
			query: AttemptFilterQuery,
		})
		.handle(async (data) => {
			const testId = data.params.testId;
			const filter = data.query;
			const result = await HistoryQueryService.getTestAttempts(testId, filter);
			return result;
		}).build();

	router.endpoint().get('/attempts/:attemptId')
		.before(ManagerGuardHandler)
		.schema({
			params: AttemptIdParams,
		})
		.handle(async (data) => {
			const attemptId = data.params.attemptId;
			const result = await HistoryQueryService.getAttemptDetail(attemptId);
			return result;
		}).build();

	router.endpoint().get('/attempts/:attemptId/answers')
		.before(ManagerGuardHandler)
		.schema({
			params: AttemptIdParams,
			query: AttemptFilterQuery,
		})
		.handle(async (data) => {
			const attemptId = data.params.attemptId;
			const filter = data.query;
			const result = await HistoryQueryService.getAttemptAnswers(attemptId, filter);
			return result;
		}).build();

	router.endpoint().get('/candidate/attempts')
		.before(ManagerGuardHandler)
		.schema({
			query: AttemptFilterQuery,
		})
		.handle(async (data) => {
			const candidateId = data.meta.id;
			const filter = data.query;
			const result = await HistoryQueryService.getCandidateAttempts(candidateId, filter);
			return result;
		}).build();

	router.endpoint().get('/candidate/tests/:testId/attempts')
		.before(ManagerGuardHandler)
		.schema({
			params: TestIdParams,
			query: AttemptFilterQuery,
		})
		.handle(async (data) => {
			const candidateId = data.meta.id;
			const testId = data.params.testId;
			const filter = data.query;
			const result = await HistoryQueryService.getCandidateAttempt(candidateId, testId, filter);
			return result;
		}).build();

	return router;
}