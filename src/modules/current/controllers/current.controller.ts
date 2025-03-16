import { XRoleIdSchema } from "../../../common/controller/schemas/headers";
import { UserIdMetaSchema } from "../../../common/controller/schemas/meta";
import { TestIdParamsSchema } from "../../../common/controller/schemas/params";
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
			meta: UserIdMetaSchema,
			headers: XRoleIdSchema,
			response: CurrentAttemptSmallResponseSchema.nullable(),
		}).handle(async data => {
			const testId = data.params.testId;
			const candidateId = data.headers["x-role-id"];
			const current = await ProcessQueryService.getInProgressAttemptSmall(testId, candidateId);
			return current;
		}).build({ tags: ['Current'] });

	router.endpoint().post('/tests/:testId/current/new')
		.schema({
			params: TestIdParamsSchema,
			meta: UserIdMetaSchema,
			headers: XRoleIdSchema,
		}).handle(async data => {
			const testId = data.params.testId;
			const candidateId = data.headers["x-role-id"];
			await ProcessCommandService.startNew(testId, candidateId);
		}).build({ tags: ['Current'] });

	router.endpoint().get('/tests/:testId/current/do')
		.schema({
			params: TestIdParamsSchema,
			meta: UserIdMetaSchema,
			headers: XRoleIdSchema,
			response: CurrentAttemptDetailResponseSchema
		}).handle(async data => {
			const testId = data.params.testId;
			const candidateId = data.headers["x-role-id"];
			const attemptDetail = await ProcessQueryService.getInProgressAttemptToDo(testId, candidateId);
			return attemptDetail;
		}).build({ tags: ['Current'], summary: 'Prepare the test for the candidate to do' });

	router.endpoint().patch('/tests/:testId/current/answer')
		.schema({
			params: TestIdParamsSchema,
			meta: UserIdMetaSchema,
			headers: XRoleIdSchema,
			body: AnswerAttemptBodySchema,
		}).handle(async data => {
			const testId = data.params.testId;
			const candidateId = data.headers["x-role-id"];
			const body = data.body;
			await ProcessCommandService.answer(testId, candidateId, body);
		}).build({ tags: ['Current'] });

	router.endpoint().post('/tests/:testId/current/submit')
		.schema({
			params: TestIdParamsSchema,
			headers: XRoleIdSchema,
			meta: UserIdMetaSchema,
		}).handle(async data => {
			const testId = data.params.testId;
			const candidateId = data.headers["x-role-id"];
			await ProcessCommandService.submit(testId, candidateId);
		}).build({ tags: ['Current'] });
}