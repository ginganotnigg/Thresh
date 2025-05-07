import { z } from "zod";
import { PagedSchema } from "../../../controller/schemas/base";
import { AttemptIdParamsSchema } from "../../../controller/schemas/params";
import { AttemptInfoSchema } from "../../../domain/schema/info.schema";
import { Chuoi } from "../../../library/caychuoijs";
import { queryAttempt } from "../app/query/attempt";
import { queryAttempts } from "../app/query/attempts";
import { AttemptAggregateQuerySchema, AttemptComputeQuerySchema, AttemptComputeResponseSchema, AttemptsCurrentQuerySchema, AttemptsQuerySchema, CreateAttemptBodySchema } from "../schema/controller-schema";
import { AnswerCoreSchema } from "../../../domain/schema/core.schema";
import { queryAttemptAnswers } from "../app/query/attempt-answers";
import { queryAttemptsCurrent } from "../app/query/attempts-current";
import { queryAttemptAggregate } from "../app/query/attempt-aggregate";
import { queryAttemptCompute } from "../app/query/attempt-compute";
import { AttemtpIdSchema } from "../../../domain/schema/id.schema";
import { commandCreateAttempt } from "../app/command/create-attempt";
import { commandAnswerAttempt } from "../app/command/answer-attempt";
import { commandSubmitAttempt } from "../app/command/submit-attempt";

export function attemptController() {
	const router = Chuoi.newRoute();

	router.endpoint().get('/attempts')
		.schema({
			query: AttemptsQuerySchema,
			response: PagedSchema(AttemptInfoSchema)
		})
		.handle(async (data) => {
			return await queryAttempts(data.query);
		}).build({
			tags: ['Attempts'],
		});

	router.endpoint().get('/attempts/current')
		.schema({
			query: AttemptsCurrentQuerySchema,
			response: AttemptInfoSchema,
		})
		.handle(async (data) => {
			return await queryAttemptsCurrent(data.query);
		}).build({
			tags: ['Attempts'],
		});

	router.endpoint().get('/attempts/:attemptId')
		.schema({
			params: AttemptIdParamsSchema,
			response: AttemptInfoSchema,
		})
		.handle(async (data) => {
			return await queryAttempt(data.params.attemptId);
		}).build({
			tags: ['Attempts'],
		});

	router.endpoint().get('/attempts/:attemptId/answers')
		.schema({
			params: AttemptIdParamsSchema,
			response: z.array(AnswerCoreSchema),
		})
		.handle(async (data) => {
			const attemptId = data.params.attemptId;
			return await queryAttemptAnswers(attemptId);
		}).build({
			tags: ['Attempts'],
		});

	router.endpoint().get('/attempts/:attemptId/aggregate')
		.schema({
			params: AttemptIdParamsSchema,
			query: AttemptAggregateQuerySchema,
			response: AttemptComputeResponseSchema,
		}).handle(async (data) => {
			return await queryAttemptAggregate(data.params.attemptId, data.query);
		}).build({
			tags: ['Attempts'],
		});

	router.endpoint().get('/attempts/:attemptId/compute')
		.schema({
			params: AttemptIdParamsSchema,
			query: AttemptComputeQuerySchema,
			response: AttemptComputeResponseSchema,
		}).handle(async (data) => {
			return await queryAttemptCompute(data.params.attemptId, data.query);
		}).build({
			tags: ['Attempts'],
		});

	router.endpoint().post('/attempts')
		.schema({
			body: CreateAttemptBodySchema,
			response: AttemtpIdSchema,
		})
		.handle(async (data) => {
			return await commandCreateAttempt(data.body);
		}).build({
			tags: ['Attempts'],
		});

	router.endpoint().patch('/attempts/:attemptId/answer')
		.schema({
			params: AttemptIdParamsSchema,
			query: z.object({
				questionId: z.number(),
				chosenOption: z.number().nullable(),
			}),
			response: z.void(),
		})
		.handle(async (data) => {
			const attemptId = data.params.attemptId;
			const { questionId, chosenOption } = data.query;
			return await commandAnswerAttempt(attemptId, questionId, chosenOption);
		}).build({
			tags: ['Attempts'],
		});

	router.endpoint().patch('/attempts/:attemptId/submit')
		.schema({
			params: AttemptIdParamsSchema,
			response: z.void(),
		})
		.handle(async (data) => {
			const attemptId = data.params.attemptId;
			return await commandSubmitAttempt(attemptId);
		}).build({
			tags: ['Attempts'],
		});

	return router;
}