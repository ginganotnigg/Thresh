import { z } from "zod";
import { Chuoi } from "../../../library/caychuoijs";
import { TestIdParamsSchema } from "../../../controller/schemas/params";
import { PracticeTestInfoSchema } from "../../../domain/schema/info.schema";
import { CredentialsMetaSchema } from "../../../controller/schemas/meta";
import { TestsQuerySchema } from "../../../domain/schema/query.schema";
import { PagedSchema } from "../../../controller/schemas/base";
import { PracticesRead } from "../usecase/practice/practices.read";
import { PracticeRead } from "../usecase/practice/practice.read";
import { QuestionToDoSchema } from "../../../domain/schema/variants.schema";
import { QuestionCoreSchema } from "../../../domain/schema/core.schema";
import { PracticeWrite } from "../usecase/practice/practices.write";
import { CreatePracticeBodySchema } from "../schema";
import { securityDocument } from "../../../controller/documents/security";

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
		.addSecurityDocument(securityDocument, "authorization")
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