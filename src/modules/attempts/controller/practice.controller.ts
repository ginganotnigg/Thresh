import { z } from "zod";
import { CredentialsMetaSchema } from "../../../controller/schemas/meta";
import { AttemptIdParamsSchema, TestIdParamsSchema } from "../../../controller/schemas/params";
import { Chuoi } from "../../../library/caychuoijs";
import { AttemptAggregateSchema, AttemptsListSchema, AttemptsOfTestAggregateSchema, AttemptsOfTestQuerySchema } from "../schema/test.schema";
import { AttemptInfoSchema } from "../../../domain/schema/info.schema";
import { AnswerCoreSchema } from "../../../domain/schema/core.schema";
import { AttemptsOfPracticeRead } from "../usecase/practice/attempts-of-practice.read";
import { AttemptOfPracticeRead } from "../usecase/practice/attempt-of-practice.read";
import { AttemptsOfPracticeWrite } from "../usecase/practice/attempts-of-practice.write";

export function practiceController() {
	const router = Chuoi.newRoute("/practice");

	router.endpoint().get("/:testId/attempts")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			query: AttemptsOfTestQuerySchema,
			response: AttemptsListSchema,
		})
		.handle(async data => {
			return await (await AttemptsOfPracticeRead.create(data.params.testId, data.meta)).getAttemptsOfTest(data.query);
		})
		.build({ tags: ["Attempts of Practice"] });

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
			return await (await AttemptsOfPracticeRead.create(data.params.testId, data.meta)).getAttemptsAggregate();
		})
		.build({ tags: ["Attempts of Practice"] });

	router.endpoint().get("/attempts/:attemptId")
		.schema({
			meta: CredentialsMetaSchema,
			params: AttemptIdParamsSchema,
			response: AttemptInfoSchema,
		})
		.handle(async data => {
			return await (await AttemptOfPracticeRead.create(data.params.attemptId, data.meta)).getAttempt();
		})
		.build({ tags: ["Attempts of Practice"] });

	router.endpoint().get("/attempts/:attemptId/aggregate")
		.schema({
			meta: CredentialsMetaSchema,
			params: AttemptIdParamsSchema,
			response: AttemptAggregateSchema,
		})
		.handle(async data => {
			return await (await AttemptOfPracticeRead.create(data.params.attemptId, data.meta)).getAttemptAggregate();
		})
		.build({ tags: ["Attempts of Practice"] });

	router.endpoint().get("/attempts/:attemptId/answers")
		.schema({
			meta: CredentialsMetaSchema,
			params: AttemptIdParamsSchema,
			response: z.array(AnswerCoreSchema),
		})
		.handle(async (data) => {
			const read = await AttemptOfPracticeRead.create(data.params.attemptId, data.meta);
			const answers = await read.getAttemptAnswers();
			return answers;
		})
		.build({ tags: ["Attempts of Practice"] });

	router.endpoint().post("/:testId/attempts/start")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
		})
		.handle(async data => {
			const write = await AttemptsOfPracticeWrite.load(data.params.testId, data.meta);
			await write.start();
			return;
		})
		.build({ tags: ["Attempts of Practice"] });

	return router;
}
