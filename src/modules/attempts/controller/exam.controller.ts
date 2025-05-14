import { z } from "zod";
import { CredentialsMetaSchema } from "../../../controller/schemas/meta";
import { AttemptIdParamsSchema, TestIdParamsSchema } from "../../../controller/schemas/params";
import { Chuoi } from "../../../library/caychuoijs";
import { AttemptsOfExamRead } from "../domain/exam/attempts-of-exam.read";
import { AttemptAggregateSchema, AttemptsListSchema, AttemptsOfExamAggregateSchema, AttemptsOfExamQuerySchema } from "../schema/exam.schema";
import { AttemptOfExamRead } from "../domain/exam/attempt-of-exam.read";
import { AttemptInfoSchema } from "../../../domain/schema/info.schema";
import { AnswerCore, AnswerCoreSchema } from "../../../domain/schema/core.schema";

export function historyController() {
	const router = Chuoi.newRoute("/exam");

	router.endpoint().get("/:testId/attempts")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			query: AttemptsOfExamQuerySchema,
			response: AttemptsListSchema,
		})
		.handle(async data => {
			return await (await AttemptsOfExamRead.create(data.params.testId, data.meta)).getCandidatesAttempts(data.query);
		})
		.build({ tags: ["Attempts of Exam"] });

	router.endpoint().get("/:testId/attempts/self")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			query: AttemptsOfExamQuerySchema,
			response: AttemptsListSchema,
		})
		.handle(async data => {
			return await (await AttemptsOfExamRead.create(data.params.testId, data.meta)).getSelfAttempts(data.query);
		})
		.build({ tags: ["Attempts of Exam"] });


	router.endpoint().get("/:testId/attempts/aggregate")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			query: z.object({
				candidateId: z.string().optional(),
			}),
			response: AttemptsOfExamAggregateSchema,
		})
		.handle(async data => {
			return await (await AttemptsOfExamRead.create(data.params.testId, data.meta)).getAttemptsAggregate(data.query.candidateId);
		})
		.build({ tags: ["Attempts of Exam"] });

	router.endpoint().get("/attempts/:attemptId")
		.schema({
			meta: CredentialsMetaSchema,
			params: AttemptIdParamsSchema,
			response: AttemptInfoSchema,
		})
		.handle(async data => {
			return await (await AttemptOfExamRead.create(data.params.attemptId, data.meta)).getAttempt();
		})
		.build({ tags: ["Attempts of Exam"] });

	router.endpoint().get("/attempts/:attemptId/aggregate")
		.schema({
			meta: CredentialsMetaSchema,
			params: AttemptIdParamsSchema,
			response: AttemptAggregateSchema,
		})
		.handle(async data => {
			return await (await AttemptOfExamRead.create(data.params.attemptId, data.meta)).getAttemptAggregate();
		})
		.build({ tags: ["Attempts of Exam"] });

	router.endpoint().get("/attempts/:attemptId/answers")
		.schema({
			meta: CredentialsMetaSchema,
			params: AttemptIdParamsSchema,
			response: z.array(AnswerCoreSchema),
		})
		.handle(async (data) => {
			const read = await AttemptOfExamRead.create(data.params.attemptId, data.meta);
			const answers = await read.getAttemptAnswers();
			return answers;
		})
		.build({ tags: ["Attempts of Exam"] });

	return router;
}
