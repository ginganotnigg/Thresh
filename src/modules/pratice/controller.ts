import { QuestionIdParamsSchema, TestIdParamsSchema } from "../../controller/schemas/params";
import { Chuoi } from "../../library/caychuoijs";
import { z } from "zod";
import { querySelfTests } from "./query/self-tests";
import { GetSelfTestsResponseSchema, QuestionIdSchema } from "./schema/query.schema";
import { GetSelfTestsQuerySchema } from "./schema/query.schema";
import { RandomService } from "../../services/random.service";
import { queryTest } from "./query/test";
import { DomainErrorResponse } from "../../controller/errors/domain.error";
import { queryTestQuestions } from "./query/test-questions";
import { commandCreatePratice, CreatePraticeSchema } from "./command/create-pratice";
import { deletePracticeCommand as commandDeletePractice } from "./command/delete-pratice";
import { queryTestQuestionsNoAnswers } from "./query/test-questions-no-answers";
import { TestInfoSchema, QuestionNoAnswerSchema } from "../../domain/tests/schema/extend.schema";
import { QuestionCoreSchema } from "../../domain/tests/schema/core.schema";

export function manageController() {
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
			tags: ['Pratice'],
			summary: 'Get one Test that is the challenge of the day (current is random by day)',
		});

	router.endpoint().get('/tests/:testId')
		.schema({
			params: TestIdParamsSchema,
			response: TestInfoSchema,
		}).handle(async data => {
			return await queryTest({ testId: data.params.testId });
		}).build({ tags: ['Pratice'] });

	router.endpoint().get('/tests/:testId/questions')
		.schema({
			params: TestIdParamsSchema,
			response: z.array(QuestionCoreSchema),
		}).handle(async data => {
			return await queryTestQuestions({ testId: data.params.testId });
		}).build({
			tags: ['Pratice'],
			summary: 'Return questions with answers.',
		});

	router.endpoint().get('/tests/:testId/questions-no-answer')
		.schema({
			params: TestIdParamsSchema,
			response: z.array(QuestionNoAnswerSchema),
		}).handle(async data => {
			return await queryTestQuestionsNoAnswers({ testId: data.params.testId });
		}).build({
			tags: ['Pratice'],
			summary: 'Return questions without answers.',
		});

	router.endpoint().get('/questions/:questionId')
		.schema({
			params: QuestionIdParamsSchema,
			response: QuestionCoreSchema,
		})
		.handle(async data => {
			return await queryTestQuestions({ testId: data.params.questionId });
		}).build({
			tags: ['Pratice'],
			summary: 'Return question (full) by questionId.',
		});

	router.endpoint().post('/tests')
		.schema({
			body: CreatePraticeSchema,
			response: z.object({
				id: z.string(),
			}),
		}).handle(async data => {
			return await commandCreatePratice(data.body);
		}).build({ tags: ['Pratice'] });

	router.endpoint().delete('/tests/:testId')
		.schema({
			params: TestIdParamsSchema,
		}).handle(async data => {
			await commandDeletePractice({ testId: data.params.testId });
		}).build({ tags: ['Pratice'] });
}