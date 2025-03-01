import { ManagerGuardHandler } from "../../common/controller/guards/manager.guard";
import { Chuoi } from "../../library/caychuoijs";
import { HistoryQueryService } from "./history.query.service";
import { AttemptFilterQuerySchema } from "./schemas/request";
import { AttemptIdParamsSchema, TestIdParamsSchema } from "../../common/controller/schemas/params";

export function historyController() {
	const router = Chuoi.newRoute();

	router.endpoint().get('/tests/:testId/attempts')
		.before(ManagerGuardHandler)
		.schema({
			params: TestIdParamsSchema,
			query: AttemptFilterQuerySchema,
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
			params: AttemptIdParamsSchema,
		})
		.handle(async (data) => {
			const attemptId = data.params.attemptId;
			const result = await HistoryQueryService.getAttemptDetail(attemptId);
			return result;
		}).build();

	router.endpoint().get('/attempts/:attemptId/answers')
		.before(ManagerGuardHandler)
		.schema({
			params: AttemptIdParamsSchema,
			query: AttemptFilterQuerySchema,
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
			query: AttemptFilterQuerySchema,
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
			params: TestIdParamsSchema,
			query: AttemptFilterQuerySchema,
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