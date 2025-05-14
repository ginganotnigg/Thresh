import { z } from "zod";
import { Chuoi } from "../../../library/caychuoijs";
import { commandCreatePractice, CreatePracticeSchema } from "../command/practice/create-practice";
import { QuestionIdParamsSchema, TestIdParamsSchema } from "../../../controller/schemas/params";
import { commandDeletePractice } from "../command/practice/delete-practice";
import { GetPracticeTestsQuerySchema, GetPracticeTestsResponseSchema } from "../schema";
import { querySelfTests } from "../query/tests";
import { TestPracticeInfoSchema } from "../../../domain/schema/info.schema";
import { querySelfTest } from "../query/test";
import { CredentialsMetaSchema } from "../../../controller/schemas/meta";
import { querySelfQuestions } from "../query/questions";
import { querySelfQuestionsNoAnswers } from "../query/questions-no-anwsers";
import querySelfQuestion from "../query/question";

export default function controllerPractice() {
	const router = Chuoi.newRoute();

	router.endpoint().get('/self/practices')
		.schema({
			meta: CredentialsMetaSchema,
			query: GetPracticeTestsQuerySchema,
			response: GetPracticeTestsResponseSchema,
		}).handle(async data => {
			return await querySelfTests(data.meta.userId, data.query);
		}).build({ tags: ['Practice'] });

	router.endpoint().get('/self/practices/:testId')
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			response: TestPracticeInfoSchema,
		}).handle(async data => {
			return await querySelfTest(data.params.testId, data.meta.userId);
		}).build({ tags: ['Practice'] });

	router.endpoint().get('/self/practices/:testId/questions')
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
		}).handle(async data => {
			return await querySelfQuestions(data.params.testId, data.meta.userId);
		}).build({ tags: ['Practice'] });

	router.endpoint().get('/self/practices/:testId/questions-no-answer')
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
		}).handle(async data => {
			return await querySelfQuestionsNoAnswers(data.params.testId, data.meta.userId);
		}).build({ tags: ['Practice'] });

	router.endpoint().get('/self/questions/:questionId')
		.schema({
			meta: CredentialsMetaSchema,
			params: QuestionIdParamsSchema,
		}).handle(async data => {
			return await querySelfQuestion(data.params.questionId, data.meta.userId);
		}).build({ tags: ['Practice'] });

	router.endpoint().post('/self/practices')
		.schema({
			meta: CredentialsMetaSchema,
			body: CreatePracticeSchema,
			response: z.object({
				testId: z.string(),
			}),
		}).handle(async data => {
			return await commandCreatePractice(data.meta.userId, data.body);
		}).build({ tags: ['Practice'] });

	router.endpoint().delete('/self/practices/:testId')
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
		}).handle(async data => {
			await commandDeletePractice(data.meta.userId, data.params.testId);
		}).build({ tags: ['Practice'] });
}