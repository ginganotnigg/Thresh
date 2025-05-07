import { z } from "zod";
import { Chuoi } from "../../library/caychuoijs";
import { QuestionIdParamsSchema, TestIdParamsSchema } from "../../controller/schemas/params";
import { querySelfTests } from "./query/self-tests";
import { GetSelfTestsResponseSchema, TestAggregateQuerySchema, TestAggregateResponseSchema } from "./schema";
import { GetSelfTestsQuerySchema } from "./schema";
import { RandomService } from "../../services/random.service";
import { queryTest } from "./query/test";
import { DomainErrorResponse } from "../../controller/errors/domain.error";
import { queryTestQuestions } from "./query/test-questions";
import { commandCreatePractice, CreatePracticeSchema } from "./command/create-practice";
import { commandDeletePractice } from "./command/delete-practice";
import { queryTestQuestionsNoAnswers } from "./query/test-questions-no-answers";
import { TestInfoSchema } from "../../domain/schema/info.schema";
import { QuestionNoAnswerSchema } from "./schema";
import { QuestionCoreSchema } from "../../domain/schema/core.schema";
import { queryTestAggregate } from "./query/test-aggregate";

export function controllerPractice() {
	const router = Chuoi.newRoute();

	router.endpoint().get('/tests/by-author')
		.schema({
			query: GetSelfTestsQuerySchema,
			response: GetSelfTestsResponseSchema,
		}).handle(async data => {
			return await querySelfTests(data.query);
		}).build({ tags: ['Practice'] });

	router.endpoint().get('/tests/challenge-of-the-day')
		.schema({
			response: TestInfoSchema,
		}).handle(async () => {
			const testId = RandomService.getTodayRandomTestId();
			if (!testId) {
				throw new DomainErrorResponse("No test found for today");
			}
			return await queryTest({ testId });
		}).build({
			tags: ['Practice'],
			summary: 'Get one Test that is the challenge of the day (current is random by day)',
		});

	router.endpoint().get('/tests/:testId')
		.schema({
			params: TestIdParamsSchema,
			response: TestInfoSchema,
		}).handle(async data => {
			return await queryTest({ testId: data.params.testId });
		}).build({ tags: ['Practice'] });

	router.endpoint().get('/tests/:testId/questions')
		.schema({
			params: TestIdParamsSchema,
			response: z.array(QuestionCoreSchema),
		}).handle(async data => {
			return await queryTestQuestions({ testId: data.params.testId });
		}).build({
			tags: ['Practice'],
			summary: 'Return questions with answers.',
		});

	router.endpoint().get('/tests/:testId/questions-no-answer')
		.schema({
			params: TestIdParamsSchema,
			response: z.array(QuestionNoAnswerSchema),
		}).handle(async data => {
			return await queryTestQuestionsNoAnswers({ testId: data.params.testId });
		}).build({
			tags: ['Practice'],
			summary: 'Return questions without answers.',
		});

	router.endpoint().get('/tests/:testId/aggregate')
		.schema({
			params: TestIdParamsSchema,
			query: TestAggregateQuerySchema,
			response: TestAggregateResponseSchema,
		})
		.handle(async data => {
			return await queryTestAggregate(data.params.testId, data.query);
		})
		.build({
			tags: ['Practice'],
		})

	router.endpoint().get('/questions/:questionId')
		.schema({
			params: QuestionIdParamsSchema,
			response: QuestionCoreSchema,
		})
		.handle(async data => {
			return await queryTestQuestions({ testId: data.params.questionId });
		}).build({
			tags: ['Practice'],
			summary: 'Return question (full) by questionId.',
		});

	router.endpoint().post('/tests')
		.schema({
			body: CreatePracticeSchema,
			response: z.object({
				id: z.string(),
			}),
		}).handle(async data => {
			return await commandCreatePractice(data.body);
		}).build({ tags: ['Practice'] });

	router.endpoint().delete('/tests/:testId')
		.schema({
			params: TestIdParamsSchema,
		}).handle(async data => {
			await commandDeletePractice({ testId: data.params.testId });
		}).build({ tags: ['Practice'] });


}