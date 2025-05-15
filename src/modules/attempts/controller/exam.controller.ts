import { z } from "zod";
import { CredentialsMetaSchema } from "../../../controller/schemas/meta";
import { AttemptIdParamsSchema, TestIdParamsSchema } from "../../../controller/schemas/params";
import { Chuoi } from "../../../library/caychuoijs";
import { AttemptsOfExamRead } from "../usecase/exam/attempts-of-exam.read";
import { AttemptAggregateSchema, AttemptsListSchema, AttemptsOfCandidateInTestAggregateSchema, AttemptsOfTestAggregateSchema, AttemptsOfTestQuerySchema } from "../schema/test.schema";
import { AttemptOfExamRead } from "../usecase/exam/attempt-of-exam.read";
import { AttemptInfoSchema } from "../../../domain/schema/info.schema";
import { AnswerCoreSchema } from "../../../domain/schema/core.schema";
import { AttemptsOfExamWrite } from "../usecase/exam/attempts-of-exam.write";

export function examController() {
	const router = Chuoi.newRoute("/exam");

	router.endpoint().get("/:testId/attempts")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			query: AttemptsOfTestQuerySchema,
			response: AttemptsListSchema,
		})
		.handle(async data => {
			return await (await AttemptsOfExamRead.load(data.params.testId, data.meta)).getAttemptsOfTest(data.query);
		})
		.build({ tags: ["Attempts of Exam"] });

	router.endpoint().get("/:testId/attempts/self")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			query: AttemptsOfTestQuerySchema,
			response: AttemptsListSchema,
		})
		.handle(async data => {
			return await (await AttemptsOfExamRead.load(data.params.testId, data.meta)).getSelfAttempts(data.query);
		})
		.build({ tags: ["Attempts of Exam"] });


	router.endpoint().get("/:testId/attempts/aggregate")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			query: z.object({
				candidateId: z.string().optional(),
			}),
			response: AttemptsOfTestAggregateSchema,
		})
		.handle(async data => {
			return await (await AttemptsOfExamRead.load(data.params.testId, data.meta)).getAttemptsAggregate();
		})
		.build({ tags: ["Attempts of Exam"] });

	router.endpoint().get("/:testId/candidate/:candidateId/attempts/aggregate")
		.schema({
			meta: CredentialsMetaSchema,
			params: z.object({
				testId: z.string(),
				candidateId: z.string(),
			}),
			query: z.object({
				candidateId: z.string().optional(),
			}),
			response: AttemptsOfCandidateInTestAggregateSchema,
		})
		.handle(async data => {
			return await (await AttemptsOfExamRead.load(data.params.testId, data.meta)).getAttemptsOfCandidateInTestAggregate(data.params.candidateId);
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

	router.endpoint().post("/:testId/attempts/start")
		.schema({
			meta: CredentialsMetaSchema,
			params: z.object({
				testId: z.string(),
			}),
		})
		.handle(async (data) => {
			const write = await AttemptsOfExamWrite.load(data.params.testId, data.meta);
			await write.start();
			return;
		})
		.build({ tags: ["Attempts of Exam"] });

	return router;
}
