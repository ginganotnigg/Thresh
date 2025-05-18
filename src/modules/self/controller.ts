import { z } from "zod";
import { PagedSchema } from "../../controller/schemas/base";
import { CredentialsMetaSchema } from "../../controller/schemas/meta";
import { TestIdParamsSchema } from "../../controller/schemas/params";
import { TestAggregateSchema } from "../../domain/schema/aggregate.schema";
import { Chuoi } from "../../library/caychuoijs";
import { AttemptsOfCandidateQuerySchema, AttemptWithTestSchema } from "../attempts/schema/history.schema";
import { SelfTestRead } from "./usecase/self-test.read";
import { SelfAttemptsRead } from "./usecase/self-attempts.read";
import { AttemptAggregateSchema } from "../attempts/schema/of-test.schema";
import { AnswerCoreSchema, QuestionCoreSchema } from "../../domain/schema/core.schema";
import { QuestionToDoSchema } from "../../domain/schema/variants.schema";

export function testController() {
	const router = Chuoi.newRoute("/self");

	router.endpoint().get("/tests/:testId")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
		})
		.handle(async data => {
			return (await SelfTestRead.load(data.params.testId, data.meta)).getTest();
		})
		.build({ tags: ["Self"] });

	router.endpoint().get("/tests/:testId/aggregate")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			response: TestAggregateSchema,
		})
		.handle(async data => {
			return (await SelfTestRead.load(data.params.testId, data.meta)).getTestAggregate();
		})
		.build({ tags: ["Self"] });

	router.endpoint().get("/tests/:testId/questions-to-do")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			response: z.array(QuestionToDoSchema),
		})
		.handle(async data => {
			return (await SelfTestRead.load(data.params.testId, data.meta)).getTestQuestionsToDo();
		})
		.build({ tags: ["Self"] });

	router.endpoint().get("/tests/:testId/questions-with-answers")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			response: z.array(QuestionCoreSchema),
		})
		.handle(async data => {
			return (await SelfTestRead.load(data.params.testId, data.meta)).getTestQuestionsWithAnswers();
		})
		.build({ tags: ["Self"] });

	router.endpoint().get("/attempts")
		.schema({
			meta: CredentialsMetaSchema,
			query: AttemptsOfCandidateQuerySchema,
			response: PagedSchema(AttemptWithTestSchema),
		})
		.handle(async (data) => {
			return SelfAttemptsRead.create(data.meta).getAttemptsWithTest(data.query);
		}).build({
			tags: ['Self'],
		});

	router.endpoint().get("/attempts/:attemptId")
		.schema({
			meta: CredentialsMetaSchema,
			params: z.object({
				attemptId: z.string(),
			}),
			response: AttemptWithTestSchema,
		})
		.handle(async (data) => {
			return SelfAttemptsRead.create(data.meta).getAttemptWithTest(data.params.attemptId);
		}).build({
			tags: ['Self'],
		});

	router.endpoint().get("/attempts/:attemptId/aggregate")
		.schema({
			meta: CredentialsMetaSchema,
			params: z.object({
				attemptId: z.string(),
			}),
			response: AttemptAggregateSchema,
		})
		.handle(async (data) => {
			return SelfAttemptsRead.create(data.meta).getAttemptAggregate(data.params.attemptId);
		}).build({
			tags: ['Self'],
		});

	router.endpoint().get("/attempts/:attemptId/answers")
		.schema({
			meta: CredentialsMetaSchema,
			params: z.object({
				attemptId: z.string(),
			}),
			response: z.array(AnswerCoreSchema),
		})
		.handle(async (data) => {
			return SelfAttemptsRead.create(data.meta).getAttemptAnswers(data.params.attemptId);
		}).build({
			tags: ['Self'],
		});
}