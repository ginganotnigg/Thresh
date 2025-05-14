import { z } from "zod";
import { PagedSchema } from "../../../controller/schemas/base";
import { AttemptIdParamsSchema } from "../../../controller/schemas/params";
import { AttemptInfoSchema } from "../../../domain/schema/info.schema";
import { Chuoi } from "../../../library/caychuoijs";
import { queryAttempt } from "../app/query/attempt";
import { queryAttempts } from "../app/query/attempts";
import { AttemptAggregateQuerySchema, AttemptAggregateResponseSchema } from "../schema";
import { AttemptsQueryParamsSchema } from "../domain/attempts.query";
import { AnswerCoreSchema } from "../../../domain/schema/core.schema";
import { queryAttemptAnswers } from "../app/query/attempt-answers";
import { queryAttemptAggregate } from "../app/query/attempt-aggregate";
import { CredentialsMetaSchema } from "../../../controller/schemas/meta";

export function historyController() {
	const router = Chuoi.newRoute("/self");

	router.endpoint().get('/attempts')
		.schema({
			meta: CredentialsMetaSchema,
			query: AttemptsQueryParamsSchema.omit({ candidateId: true }),
			response: PagedSchema(AttemptInfoSchema)
		})
		.handle(async (data) => {
			return await queryAttempts({
				...data.query,
				candidateId: data.meta.userId,
			});
		}).build({
			tags: ['History'],
			description: 'Get all attempts of a candidate',
		});

	router.endpoint().get('/attempts/:attemptId')
		.schema({
			params: AttemptIdParamsSchema,
			response: AttemptInfoSchema,
		})
		.handle(async (data) => {
			return await queryAttempt(data.params.attemptId);
		}).build({
			tags: ['History'],
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

	return router;
}