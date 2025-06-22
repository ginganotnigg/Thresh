import { Chuoi } from "../../library/caychuoijs";
import { ControllerBase } from "../../shared/controller/controller.base";
import { FeedbackIdParamsSchema } from "../../shared/controller/schemas/params";
import { FeedbackCrudService } from "./crud";
import { GetFeedbackResponseSchema, GetFeedbacksQuerySchema, GetFeedbacksResponseSchema, PostFeedbackBodySchema, PutFeedbackBodySchema } from "./resouce.schema";

export class FeedbacksController extends ControllerBase {
	async constructRouter(): Promise<void> {
		const router = Chuoi.newRoute("/feedbacks");

		router.endpoint().get()
			.schema({
				query: GetFeedbacksQuerySchema,
				response: GetFeedbacksResponseSchema,
			})
			.handle(async (data) => {
				return await FeedbackCrudService.getFeedbacks(data.query)
			})
			.build({ tags: ["Feedbacks"] });

		router.endpoint().get("/:feedbackId")
			.schema({
				params: FeedbackIdParamsSchema,
				response: GetFeedbackResponseSchema,
			})
			.handle(async (data) => {
				return await FeedbackCrudService.getFeedbackById(data.params.feedbackId);
			})
			.build({ tags: ["Feedbacks"] });

		router.endpoint().post()
			.schema({
				body: PostFeedbackBodySchema,
			})
			.handle(async (data) => {
				return await FeedbackCrudService.createFeedback(data.body);
			})
			.build({ tags: ["Feedbacks"] });

		router.endpoint().put("/:feedbackId")
			.schema({
				params: FeedbackIdParamsSchema,
				body: PutFeedbackBodySchema,
			})
			.handle(async (data) => {
				return await FeedbackCrudService.updateFeedback(data.params.feedbackId, data.body);
			})
			.build({ tags: ["Feedbacks"] });

		router.endpoint().delete("/:feedbackId")
			.schema({
				params: FeedbackIdParamsSchema,
			})
			.handle(async (data) => {
				return await FeedbackCrudService.deleteFeedback(data.params.feedbackId);
			})
			.build({ tags: ["Feedbacks"] });
	}
}