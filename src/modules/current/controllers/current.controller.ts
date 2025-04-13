import { securityDocument } from "../../../controller/documents/security";
import { CandidateGuard } from "../../../controller/guards/candidate.guard";
import { UserPipe } from "../../../controller/pipes/user.pipe";
import { TestIdParamsSchema } from "../../../controller/schemas/params";
import { Chuoi } from "../../../library/caychuoijs";
import { ProcessCommandService } from "../services/command.service";
import { CurrentQueryService } from "../services/query.service";
import { TestDetailToDoResponseSchema, CurrentAttemptStateResponseSchema } from "./schemas/response";

export function processController() {
	const router = Chuoi.newRoute();

	router.endpoint().get('/candidate/current-attempt/state')
		.addSecurityDocument(securityDocument, "userId")
		.addSecurityDocument(securityDocument, "roleId")
		.addGuard(CandidateGuard)
		.addPipe(UserPipe)
		.schema({
			response: CurrentAttemptStateResponseSchema,
		}).handle(async data => {
			const candidateId = data.meta.userId;
			const current = await CurrentQueryService.getCurrentAttemptState(candidateId);
			return current;
		}).build({ tags: ['Current'] });

	router.endpoint().post('/candidate/current-attempt/new')
		.addSecurityDocument(securityDocument, "userId")
		.addSecurityDocument(securityDocument, "roleId")
		.addGuard(CandidateGuard)
		.addPipe(UserPipe)
		.schema({
			body: TestIdParamsSchema,
		}).handle(async data => {
			const testId = data.body.testId;
			const candidateId = data.meta.userId;
			await ProcessCommandService.startNew(testId, candidateId);
		}).build({ tags: ['Current'] });

	router.endpoint().get('/candidate/current-attempt/do')
		.addSecurityDocument(securityDocument, "userId")
		.addSecurityDocument(securityDocument, "roleId")
		.addGuard(CandidateGuard)
		.addPipe(UserPipe)
		.schema({
			response: TestDetailToDoResponseSchema
		}).handle(async data => {
			const candidateId = data.meta.userId;
			const attemptDetail = await CurrentQueryService.getTestDetailToDo(candidateId);
			return attemptDetail;
		}).build({ tags: ['Current'], summary: 'Prepare the test for the candidate to do' });

	router.endpoint().post('/candidate/current-attempt/submit')
		.addSecurityDocument(securityDocument, "userId")
		.addSecurityDocument(securityDocument, "roleId")
		.addGuard(CandidateGuard)
		.addPipe(UserPipe)
		.schema({}).handle(async data => {
			const candidateId = data.meta.userId;
			await ProcessCommandService.submit(candidateId);
		}).build({ tags: ['Current'] });
}