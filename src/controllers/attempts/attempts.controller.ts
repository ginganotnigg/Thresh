import { Chuoi } from "../../library/caychuoijs";
import { ControllerBase } from "../../shared/controller/controller.base";
import { AttemptIdParamsSchema } from "../../shared/controller/schemas/params";
import { PostAttemptBodySchema, PostAttemptAnswersBodySchema } from "./body.schema";
import { AttemptQuerySchema, AttemptsQuerySchema } from "./query.schema";
import { AttemptResourceSchema, AttemptsResourceSchema } from "./resource.schema";

export class AttemptsController extends ControllerBase {
	constructRouter(): void {
		const router = Chuoi.newRoute("/attempts");

		router.endpoint().get()
			.schema({
				query: AttemptsQuerySchema,
				response: AttemptsResourceSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Attempts"] });

		router.endpoint().get("/:attemptId")
			.schema({
				params: AttemptIdParamsSchema,
				query: AttemptQuerySchema,
				response: AttemptResourceSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Attempts"] });

		router.endpoint().post()
			.schema({
				body: PostAttemptBodySchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Attempts"] });

		router.endpoint().put("/:attemptId/answers")
			.schema({
				params: AttemptIdParamsSchema,
				body: PostAttemptAnswersBodySchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Attempts"] });

		router.endpoint().patch("/:attemptId/submit")
			.schema({
				params: AttemptIdParamsSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Attempts"] });
	}
}