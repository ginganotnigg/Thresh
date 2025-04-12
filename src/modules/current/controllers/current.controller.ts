import { securityDocument } from "../../../controller/documents/security";
import { UserPipe } from "../../../controller/pipes/user.pipe";
import { TestIdParamsSchema } from "../../../controller/schemas/params";
import { Chuoi } from "../../../library/caychuoijs";
import { ProcessCommandService } from "../services/command.service";
import { CurrentQueryService } from "../services/query.service";
import { TestDetailToDoResponseSchema, CurrentAttemptStateResponseSchema } from "./schemas/response";

export function processController() {
	const router = Chuoi.newRoute();

	router.endpoint().get('/current-attempt/state')
		.addSecurity(securityDocument, "userId")
		.addPipe(UserPipe)
		.schema({
			response: CurrentAttemptStateResponseSchema,
		}).handle(async data => {
			const candidateId = data.meta.userId;
			const current = await CurrentQueryService.getCurrentAttemptState(candidateId);
			return current;
		}).build({ tags: ['Current'] });

	router.endpoint().post('/current-attempt/new')
		.addSecurity(securityDocument, "userId")
		.addPipe(UserPipe)
		.schema({
			body: TestIdParamsSchema,
		}).handle(async data => {
			const testId = data.body.testId;
			const candidateId = data.meta.userId;
			await ProcessCommandService.startNew(testId, candidateId);
		}).build({ tags: ['Current'] });

	router.endpoint().get('/current-attempt/do')
		.addSecurity(securityDocument, "userId")
		.addPipe(UserPipe)
		.schema({
			response: TestDetailToDoResponseSchema
		}).handle(async data => {
			const candidateId = data.meta.userId;
			const attemptDetail = await CurrentQueryService.getTestDetailToDo(candidateId);
			return attemptDetail;
		}).build({ tags: ['Current'], summary: 'Prepare the test for the candidate to do' });

	router.endpoint().post('/current-attempt/submit')
		.addSecurity(securityDocument, "userId")
		.addPipe(UserPipe)
		.schema({}).handle(async data => {
			const candidateId = data.meta.userId;
			await ProcessCommandService.submit(candidateId);
		}).build({ tags: ['Current'] });
}