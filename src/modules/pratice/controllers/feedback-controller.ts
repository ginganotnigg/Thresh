import { Chuoi } from "../../../library/caychuoijs";
import { TestIdParamsSchema } from "../../../controller/schemas/params";
import { UpdateTemplateSchema } from "../command/templates/update-template";
import { FeedbackCoreSchema } from "../../../domain/schema/core.schema";
import { commandCreateFeedback, CreateFeedbackSchema } from "../command/feedbacks/create-feedback";
import { commandUpdateFeedback } from "../command/feedbacks/update-feedback";
import { commandDeleteFeedback } from "../command/feedbacks/delete-feedback";

export default function controllerFeedback() {
	const router = Chuoi.newRoute();

	router.endpoint().post('/practice-tests/:testId/feedback')
		.schema({
			params: TestIdParamsSchema,
			body: CreateFeedbackSchema,
		})
		.handle(async data => {
			await commandCreateFeedback({ ...data.body, practiceTestId: data.params.testId });
		}).build({ tags: ['Feedback'] });

	router.endpoint().put('/practice-tests/:testId/feedback')
		.schema({
			params: TestIdParamsSchema,
			body: UpdateTemplateSchema,
		})
		.handle(async data => {
			await commandUpdateFeedback({ ...data.body, practiceTestId: data.params.testId });
		}).build({ tags: ['Feedback'] });

	router.endpoint().delete('/practice-tests/:testId/feedback')
		.schema({
			params: TestIdParamsSchema,
		}).handle(async data => {
			await commandDeleteFeedback({ id: data.params.testId });
		}).build({ tags: ['Feedback'] });

}