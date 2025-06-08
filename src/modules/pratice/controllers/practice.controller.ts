import { z } from "zod";
import { Chuoi } from "../../../library/caychuoijs";
import { TestIdParamsSchema } from "../../../shared/controller/schemas/params";
import { PracticeTestInfoSchema } from "../../../shared/resource/practice.schema";
import { CredentialsMetaSchema } from "../../../shared/controller/schemas/meta";
import { TestsQuerySchema } from "../../../shared/query/filter/test.query-schema";
import { PagedSchema } from "../../../shared/controller/schemas/base";
import { PracticesRead } from "../usecase/practice/practices.read";
import { PracticeRead } from "../usecase/practice/practice.read";
import { QuestionToDoSchema } from "../../../shared/resource/question.schema";
import { QuestionCoreSchema } from "../../../shared/resource/question.schema";
import { PracticeWrite } from "../usecase/practice/practices.write";
import { CreatePracticeBodySchema } from "../schema";

export default function controllerPractice() {
	const router = Chuoi.newRoute("/practices");

	router.endpoint().get()
		.schema({
			meta: CredentialsMetaSchema,
			query: TestsQuerySchema,
			response: PagedSchema(PracticeTestInfoSchema),
		}).handle(async data => {
			return await PracticesRead.load(data.meta).getSelf(data.query);
		}).build({ tags: ['Practice'] });

	router.endpoint().get('/:testId')
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			response: PracticeTestInfoSchema,
		}).handle(async data => {
			return await PracticesRead.load(data.meta).get(data.params.testId);
		}).build({ tags: ['Practice'] });

	router.endpoint().get('/:testId/aggregate')
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			response: z.object({
				numberOfQuestions: z.number(),
				totalPoints: z.number(),
			}),
		}).handle(async data => {
			return (await PracticeRead.load(data.params.testId, data.meta)).getAggregate();
		}).build({ tags: ['Practice'] });

	router.endpoint().get('/:testId/questions-to-do')
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			response: z.array(QuestionToDoSchema),
		}).handle(async data => {
			return (await PracticeRead.load(data.params.testId, data.meta)).getQuestionsToDo();
		}).build({ tags: ['Practice'] });


	router.endpoint().get("/:testId/questions-with-answer")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			response: z.array(QuestionCoreSchema),
		}).handle(async (data) => {
			const { params: { testId } } = data;
			return await (await PracticeRead.load(testId, data.meta)).getQuestionsWithAnswers();
		}).build({
			tags: ["Practice"],
		});

	router.endpoint().post()
		.schema({
			meta: CredentialsMetaSchema,
			body: CreatePracticeBodySchema,
			response: z.object({
				testId: z.string(),
			}),
		}).handle(async data => {
			return await PracticeWrite.create(data.body, data.meta);
		}).build({ tags: ['Practice'] });

	router.endpoint().delete('/:testId')
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
		}).handle(async data => {
			await (await PracticeWrite.load(data.params.testId, data.meta)).delete();
		}).build({ tags: ['Practice'] });
}