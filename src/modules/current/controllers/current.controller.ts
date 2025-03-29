import { XUserIdSchema } from "../../../controller/schemas/headers";
import { TestIdParamsSchema } from "../../../controller/schemas/params";
import { Chuoi } from "../../../library/caychuoijs";
import { ProcessCommandService } from "../services/command.service";
import { CurrentQueryService } from "../services/query.service";
import { TestDetailToDoResponseSchema, CurrentAttemptStateResponseSchema } from "./schemas/response";

export function processController() {
	const router = Chuoi.newRoute();

	router.endpoint().get('/current-attempt/state')
		.schema({
			headers: XUserIdSchema,
			response: CurrentAttemptStateResponseSchema,
		}).handle(async data => {
			const candidateId = data.headers["x-user-id"];
			const current = await CurrentQueryService.getCurrentAttemptState(candidateId);
			return current;
		}).build({ tags: ['Current'] });

	router.endpoint().post('/current-attempt/new')
		.schema({
			headers: XUserIdSchema,
			body: TestIdParamsSchema,
		}).handle(async data => {
			const testId = data.body.testId;
			const candidateId = data.headers["x-user-id"];
			await ProcessCommandService.startNew(testId, candidateId);
		}).build({ tags: ['Current'] });

	router.endpoint().get('/current-attempt/do')
		.schema({
			headers: XUserIdSchema,
			response: TestDetailToDoResponseSchema
		}).handle(async data => {
			const candidateId = data.headers["x-user-id"];
			const attemptDetail = await CurrentQueryService.getTestDetailToDo(candidateId);
			return attemptDetail;
		}).build({ tags: ['Current'], summary: 'Prepare the test for the candidate to do' });

	router.endpoint().post('/current-attempt/submit')
		.schema({
			headers: XUserIdSchema,
		}).handle(async data => {
			const candidateId = data.headers["x-user-id"];
			await ProcessCommandService.submit(candidateId);
		}).build({ tags: ['Current'] });
}