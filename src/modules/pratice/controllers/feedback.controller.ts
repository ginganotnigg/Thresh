import { Chuoi } from "../../../library/caychuoijs";
import { TestIdParamsSchema } from "../../../shared/controller/schemas/params";
import { UpdateFeedbackBodySchema } from "../schema";
import { FeedbackCoreSchema } from "../../../shared/resource/practice.schema";
import { CreateFeedbackBodySchema } from "../schema";
import { FeedbackOfPracticeRead } from "../usecase/feedbacks/feedback-of-practice.read";
import { FeedbacksWrite } from "../usecase/feedbacks/feedbacks.write";
import { CredentialsMetaSchema } from "../../../shared/controller/schemas/meta";

export default function controllerFeedback() {
	const router = Chuoi.newRoute();

	router.endpoint().get('/practices/:testId/feedback')
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			response: FeedbackCoreSchema.nullable(),
		}).handle(async data => {
			return (await FeedbackOfPracticeRead.load(data.params.testId, data.meta)).get();
		}).build({ tags: ['Feedback'] });

	router.endpoint().post('/practices/:testId/feedback')
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			body: CreateFeedbackBodySchema,
		})
		.handle(async data => {
			await (await FeedbacksWrite.load(data.params.testId, data.meta)).submit(data.body);
		}).build({ tags: ['Feedback'] });


	router.endpoint().delete('/practices/:testId/feedback')
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
		}).handle(async data => {
			await (await FeedbacksWrite.load(data.params.testId, data.meta)).delete();
		}).build({ tags: ['Feedback'] });
}