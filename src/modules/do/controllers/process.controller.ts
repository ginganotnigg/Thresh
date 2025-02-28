import { CandidateGuardHandler } from "../../../common/controller/guards/candidate.guard";
import { UserIdMeta } from "../../../common/controller/schemas/meta";
import { TestIdParams } from "../../../common/controller/schemas/params";
import { ChuoiController } from "../../../library/caychuoijs/router.i";
import { ProcessCommandService } from "../services/command.service";
import { ProcessQueryService } from "../services/query.service";
import { AnswerAttemptBody } from "./schemas/request";

export function processController() {
	const router = ChuoiController.router().down().handler(CandidateGuardHandler);

	router.endpoint().get('/tests/:testId/current')
		.schema({
			params: TestIdParams,
			meta: UserIdMeta
		}).handle(async data => {
			const testId = data.params.testId;
			const candidateId = data.meta.userId;
			const current = await ProcessQueryService.getInProgressAttemptSmall(testId, candidateId);
			return current;
		}).build();

	router.endpoint().post('/tests/:testId/current/new')
		.schema({
			params: TestIdParams,
			meta: UserIdMeta
		}).handle(async data => {
			const testId = data.params.testId;
			const candidateId = data.meta.userId;
			await ProcessCommandService.startNew(testId, candidateId);
		}).build();

	router.endpoint().get('/tests/:testId/current/do')
		.schema({
			params: TestIdParams,
			meta: UserIdMeta
		}).handle(async data => {
			const testId = data.params.testId;
			const candidateId = data.meta.userId;
			const attemptDetail = await ProcessQueryService.getInProgressAttemptToDo(testId, candidateId);
			return attemptDetail;
		}).build();

	router.endpoint().patch('/tests/:testId/current/answer')
		.schema({
			params: TestIdParams,
			meta: UserIdMeta,
			body: AnswerAttemptBody
		}).handle(async data => {
			const testId = data.params.testId;
			const candidateId = data.meta.userId;
			const body = data.body;
			await ProcessCommandService.answer(testId, candidateId, body);
		}).build();

	router.endpoint().post('/tests/:testId/current/submit')
		.schema({
			params: TestIdParams,
			meta: UserIdMeta
		}).handle(async data => {
			const testId = data.params.testId;
			const candidateId = data.meta.userId;
			await ProcessCommandService.submit(testId, candidateId);
		}).build();
}