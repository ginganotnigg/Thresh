import { XUserIdSchema } from "../../../controller/schemas/headers";
import { TestIdParamsSchema } from "../../../controller/schemas/params";
import { Chuoi } from "../../../library/caychuoijs";
import { ProcessCommandService } from "../services/command.service";
import { ProcessQueryService } from "../services/query.service";
import { AnswerAttemptBodySchema } from "./schemas/request";
import { CurrentAttemptDetailResponseSchema, CurrentAttemptSmallResponseSchema } from "./schemas/response";

export function processController() {
	const router = Chuoi.newRoute();

	router.endpoint().get('/tests/:testId/current')
		.schema({
			params: TestIdParamsSchema,
			headers: XUserIdSchema,
			response: CurrentAttemptSmallResponseSchema.nullable(),
		}).handle(async data => {
			const testId = data.params.testId;
			const candidateId = data.headers["x-user-id"];
			const current = await ProcessQueryService.getCurrentAttemptState(testId, candidateId);
			return current;
		}).build({ tags: ['Current'] });

	router.endpoint().get('/tests/:testId/current')
		.schema({
			params: TestIdParamsSchema,
			headers: XUserIdSchema,
			response: CurrentAttemptSmallResponseSchema.nullable(),
		}).handle(async data => {
			const testId = data.params.testId;
			const candidateId = data.headers["x-user-id"];
			const current = await ProcessQueryService.getCurrentAttemptState(testId, candidateId);
			return current;
		}).build({ tags: ['Current'] });

	router.endpoint().post('/tests/:testId/current/new')
		.schema({
			params: TestIdParamsSchema,
			headers: XUserIdSchema,
		}).handle(async data => {
			const testId = data.params.testId;
			const candidateId = data.headers["x-user-id"];
			await ProcessCommandService.startNew(testId, candidateId);
		}).build({ tags: ['Current'] });

	router.endpoint().get('/tests/:testId/current/do')
		.schema({
			params: TestIdParamsSchema,
			headers: XUserIdSchema,
			response: CurrentAttemptDetailResponseSchema
		}).handle(async data => {
			const testId = data.params.testId;
			const candidateId = data.headers["x-user-id"];
			const attemptDetail = await ProcessQueryService.getInProgressAttemptToDo(testId, candidateId);
			return attemptDetail;
		}).build({ tags: ['Current'], summary: 'Prepare the test for the candidate to do' });

	router.endpoint().post('/tests/:testId/current/submit')
		.schema({
			params: TestIdParamsSchema,
			headers: XUserIdSchema,
		}).handle(async data => {
			const testId = data.params.testId;
			const candidateId = data.headers["x-user-id"];
			await ProcessCommandService.submit(testId, candidateId);
		}).build({ tags: ['Current'] });
}