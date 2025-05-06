import { securityDocument } from "../../controller/documents/security";
import { CandidateGuard } from "../../controller/guards/candidate.guard";
import { ManagerGuard } from "../../controller/guards/manager.guard";
import { UserGuard } from "../../controller/guards/user.guard";
import { UserPipe } from "../../controller/pipes/user.pipe";
import { PagedSchema } from "../../controller/schemas/base";
import { XUserIdSchema } from "../../controller/schemas/headers";
import { TestIdParamsSchema, AttemptIdParamsSchema } from "../../controller/schemas/params";
import { Chuoi } from "../../library/caychuoijs";
import { HistoryQueryService } from "./history.query.service";
import { AttemptAnswerFilterQuerySchema, AttemptFilterQuerySchema } from "./schemas/request";
import { AnswerQuestionResultSchema, AttemptItemResultSchema, AttemptResultSchema } from "./schemas/response";

export function historyController() {
	const router = Chuoi.newRoute();

	router.endpoint().get('/user/tests/:testId/attempts')
		.addSecurityDocument(securityDocument, "roleId")
		.addGuard(UserGuard)
		.schema({
			params: TestIdParamsSchema,
			query: AttemptFilterQuerySchema,
			response: PagedSchema(AttemptItemResultSchema)
		})
		.handle(async (data) => {
			const testId = data.params.testId;
			const filter = data.query;
			const result = await HistoryQueryService.getTestAttempts(testId, filter);
			return result;
		}).build({
			tags: ['History'],
			summary: 'Get all attempts of a test',
		});

	router.endpoint().get('/user/attempts/:attemptId')
		.addSecurityDocument(securityDocument, "roleId")
		.addGuard(UserGuard)
		.schema({
			params: AttemptIdParamsSchema,
			response: AttemptResultSchema,
		})
		.handle(async (data) => {
			const attemptId = data.params.attemptId;
			const result = await HistoryQueryService.getAttemptDetail(attemptId);
			return result;
		}).build({
			tags: ['History'],
			summary: 'Get detail of an attempt',
		});

	router.endpoint().get('/user/attempts/:attemptId/answers')
		.addSecurityDocument(securityDocument, "roleId")
		.addGuard(UserGuard)
		.schema({
			params: AttemptIdParamsSchema,
			query: AttemptAnswerFilterQuerySchema,
			response: PagedSchema(AnswerQuestionResultSchema)
		})
		.handle(async (data) => {
			const attemptId = data.params.attemptId;
			const filter = data.query;
			const result = await HistoryQueryService.getAttemptAnswers(attemptId, filter);
			return result;
		}).build({ tags: ['History'] });

	router.endpoint().get('/candidate/attempts')
		.addSecurityDocument(securityDocument, "userId")
		.addSecurityDocument(securityDocument, "roleId")
		.addGuard(CandidateGuard)
		.addPipe(UserPipe)
		.schema({
			query: AttemptFilterQuerySchema,
			response: PagedSchema(AttemptItemResultSchema)
		})
		.handle(async (data) => {
			const candidateId = data.meta.userId;
			const filter = data.query;
			const result = await HistoryQueryService.getCandidateAttempts(candidateId, filter);
			return result;
		}).build({
			tags: ['History'],
			summary: 'Get all attempts of the candidate'
		});

	router.endpoint().get('/candidate/tests/:testId/attempts')
		.addSecurityDocument(securityDocument, "userId")
		.addSecurityDocument(securityDocument, "roleId")
		.addGuard(CandidateGuard)
		.addPipe(UserPipe)
		.schema({
			params: TestIdParamsSchema,
			query: AttemptFilterQuerySchema,
			response: PagedSchema(AttemptItemResultSchema)
		})
		.handle(async (data) => {
			const candidateId = data.meta.userId;
			const testId = data.params.testId;
			const filter = data.query;
			const result = await HistoryQueryService.getCandidateAttempt(candidateId, testId, filter);
			return result;
		}).build({ tags: ['History'], summary: "Get all attempts of the candidate in a test" });

	return router;
}