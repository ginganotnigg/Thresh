import { Chuoi } from "../../library/caychuoijs";
import { ControllerBase } from "../../shared/controller/controller.base";
import { FeedbackIdParamsSchema } from "../../shared/schemas/params";
import { PostFeedbackBodySchema, PutFeedbackBodySchema } from "./body.schema";
import { FeedbacksQuerySchema } from "./query.schema";
import { FeedbackResourceSchema, FeedbacksResourceSchema } from "./resouce.schema";

export class FeedbacksController extends ControllerBase {
	constructRouter(): void {
		const router = Chuoi.newRoute("/feedbacks");

		router.endpoint().get()
			.schema({
				query: FeedbacksQuerySchema,
				response: FeedbacksResourceSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Feedbacks"] });

		router.endpoint().get("/:feedbackId")
			.schema({
				params: FeedbackIdParamsSchema,
				response: FeedbackResourceSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Feedbacks"] });

		router.endpoint().post()
			.schema({
				body: PostFeedbackBodySchema,
				response: FeedbackResourceSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Feedbacks"] });

		router.endpoint().put("/:feedbackId")
			.schema({
				params: FeedbackIdParamsSchema,
				body: PutFeedbackBodySchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Feedbacks"] });

		router.endpoint().delete("/:feedbackId")
			.schema({
				params: FeedbackIdParamsSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Feedbacks"] });
	}
}