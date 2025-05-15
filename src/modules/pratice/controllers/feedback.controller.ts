import { Chuoi } from "../../../library/caychuoijs";
import { TestIdParamsSchema } from "../../../controller/schemas/params";
import { UpdateFeedbackBodySchema } from "../schema";
import { FeedbackCoreSchema } from "../../../domain/schema/core.schema";
import { CreateFeedbackBodySchema } from "../schema";
import { FeedbackOfPracticeRead } from "../usecase/feedbacks/feedback-of-practice.read";
import { FeedbacksWrite } from "../usecase/feedbacks/feedbacks.write";
import { CredentialsMetaSchema } from "../../../controller/schemas/meta";

export default function controllerFeedback() {
	const router = Chuoi.newRoute();

	router.endpoint().get('/practice-tests/:testId/feedback')
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			response: FeedbackCoreSchema.nullable(),
		}).handle(async data => {
			return (await FeedbackOfPracticeRead.load(data.params.testId, data.meta)).get();
		}).build({ tags: ['Feedback'] });

	router.endpoint().post('/practice-tests/:testId/feedback')
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			body: CreateFeedbackBodySchema,
		})
		.handle(async data => {
			await (await FeedbacksWrite.load(data.params.testId, data.meta)).create(data.body);
		}).build({ tags: ['Feedback'] });

	router.endpoint().put('/practice-tests/:testId/feedback')
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			body: UpdateFeedbackBodySchema,
		})
		.handle(async data => {
			await (await FeedbacksWrite.load(data.params.testId, data.meta)).update(data.body);
		}).build({ tags: ['Feedback'] });

	router.endpoint().delete('/practice-tests/:testId/feedback')
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
		}).handle(async data => {
			await (await FeedbacksWrite.load(data.params.testId, data.meta)).delete();
		}).build({ tags: ['Feedback'] });
}