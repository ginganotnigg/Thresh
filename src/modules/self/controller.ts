import { z } from "zod";
import { PagedSchema } from "../../shared/controller/schemas/base";
import { CredentialsMetaSchema } from "../../shared/schemas/meta";
import { TestIdParamsSchema } from "../../shared/schemas/params";
import { TestAggregateSchema } from "../../shared/resource/test.schema";
import { Chuoi } from "../../library/caychuoijs";
import { AttemptsOfCandidateQuerySchema, AttemptWithTestSchema } from "../attempts/schema/history.schema";
import { SelfTestRead } from "./usecase/self-test.read";
import { SelfAttemptsRead } from "./usecase/self-attempts.read";
import { AttemptAggregateSchema } from "../attempts/schema/of-test.schema";
import { AnswerCoreSchema } from "../../shared/resource/attempt.schema";
import { QuestionCoreSchema } from "../../shared/resource/question.schema";
import { QuestionToDoSchema } from "../../shared/resource/question.schema";
import { TestInfoSchema } from "../../shared/resource/test.schema";
import { TestAggregateQuery } from "../v2_migrate/query/test-aggregate";
import { QuestionsToDoQuery } from "../v2_migrate/query/questions-to-do";

export function selfController() {
	const router = Chuoi.newRoute("/self");

	router.endpoint().get("/tests/:testId")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			response: TestInfoSchema,
		})
		.handle(async data => {
			return (await SelfTestRead.load(data.params.testId, data.meta)).getTest();
		})
		.build({
			tags: ["Self"]
		});

	router.endpoint().get("/tests/:testId/aggregate")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			response: TestAggregateSchema,
		})
		.handle(async data => {
			const query = new TestAggregateQuery(data.meta);
			return await query.query(data.params);
		})
		.build({ tags: ["Self"] });

	router.endpoint().get("/tests/:testId/questions-to-do")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			response: z.array(QuestionToDoSchema),
		})
		.handle(async data => {
			const query = new QuestionsToDoQuery(data.meta);
			return await query.query(data.params);
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