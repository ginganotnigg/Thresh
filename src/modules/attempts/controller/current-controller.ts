import { z } from "zod";
import { PagedSchema } from "../../../controller/schemas/base";
import { AttemptIdParamsSchema } from "../../../controller/schemas/params";
import { AttemptInfoSchema } from "../../../domain/schema/info.schema";
import { Chuoi } from "../../../library/caychuoijs";
import { queryAttempt } from "../app/query/attempt";
import { queryAttempts } from "../app/query/attempts";
import { AttemptAggregateQuerySchema, AttemptAggregateResponseSchema, AttemptComputeQuerySchema, AttemptComputeResponseSchema, AttemptsCurrentQuerySchema, CreateAttemptBodySchema } from "../schema";
import { AttemptsQueryParamsSchema } from "../domain/attempts.query";
import { AnswerCoreSchema } from "../../../domain/schema/core.schema";
import { queryAttemptAnswers } from "../app/query/attempt-answers";
import { queryAttemptsCurrent } from "../app/query/attempts-current";
import { queryAttemptAggregate } from "../app/query/attempt-aggregate";
import { queryAttemptCompute } from "../app/query/attempt-compute";
import commandAnswerAttempt from "../app/command/answer-attempt";
import commandSubmitAttempt from "../app/command/submit-attempt";
import { CredentialsMetaSchema } from "../../../controller/schemas/meta";

export function currentController() {
	const router = Chuoi.newRoute();

	router.endpoint().get('/self/attempts')
		.schema({
			meta: CredentialsMetaSchema,
			query: AttemptsQueryParamsSchema,
			response: PagedSchema(AttemptInfoSchema)
		})
		.handle(async (data) => {
			return await queryAttempts({
				...data.query,
				candidateId: data.meta.userId,
			});
		}).build({
			tags: ['History'],
		});

	router.endpoint().get('/attempts/current')
		.schema({
			query: AttemptsCurrentQuerySchema,
			response: AttemptInfoSchema,
		})
		.handle(async (data) => {
			return await queryAttemptsCurrent(data.query);
		}).build({
			tags: ['History'],
		});

	router.endpoint().get('/self/attempts/:attemptId')
		.schema({
			params: AttemptIdParamsSchema,
			response: AttemptInfoSchema,
		})
		.handle(async (data) => {
			return await queryAttempt(data.params.attemptId);
		}).build({
			tags: ['History'],
		});

	router.endpoint().get('/self/attempts/:attemptId/answers')
		.schema({
			params: AttemptIdParamsSchema,
			response: z.array(AnswerCoreSchema),
		})
		.handle(async (data) => {
			const attemptId = data.params.attemptId;
			return await queryAttemptAnswers(attemptId);
		}).build({
			tags: ['History'],
		});

	router.endpoint().get('/attempts/:attemptId/aggregate')
		.schema({
			params: AttemptIdParamsSchema,
			query: AttemptAggregateQuerySchema,
			response: AttemptAggregateResponseSchema,
		}).handle(async (data) => {
			return await queryAttemptAggregate(data.params.attemptId, data.query);
		}).build({
			tags: ['History'],
		});

	router.endpoint().get('/attempts/:attemptId/compute')
		.schema({
			params: AttemptIdParamsSchema,
			query: AttemptComputeQuerySchema,
			response: AttemptComputeResponseSchema,
		}).handle(async (data) => {
			return await queryAttemptCompute(data.params.attemptId, data.query);
		}).build({
			tags: ['History'],
		});

	router.endpoint().patch('/current-attempts/answer/')
		.schema({
			body: z.object({
				testId: z.string(),
				candidateId: z.string(),
				questionId: z.coerce.number(),
				chosenOption: z.coerce.number().optional(),
			}),
		})
		.handle(async (data) => {
			return await commandAnswerAttempt(data.body);
		}).build({
			tags: ["Current"],
			summary: 'Answer question in current attempt',
		});

	router.endpoint().patch('/current-attempts/submit/')
		.schema({
			body: z.object({
				testId: z.string(),
				candidateId: z.string(),
			}),
		})
		.handle(async (data) => {
			return await commandSubmitAttempt(data.body);
		}).build({
			tags: ["Current"],
			summary: 'Submit current attempt',
		});

	return router;
}