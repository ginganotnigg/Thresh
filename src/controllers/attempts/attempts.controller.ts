import { Chuoi } from "../../library/caychuoijs";
import { ControllerBase } from "../../shared/controller/controller.base";
import { CredentialsMetaSchema } from "../shared/schemas/meta";
import { AttemptIdParamsSchema } from "../shared/schemas/params";
import { PostAttemptBodySchema, PostAttemptAnswersBodySchema } from "./body.schema";
import { AttemptQuerySchema, AttemptsQuerySchema } from "./query.schema";
import { AttemptResourceSchema, AttemptsResourceSchema } from "./resource.schema";
import { GetAttemptsQuery } from "./uc_query/get-attempts-query";

export class AttemptsController extends ControllerBase {
	constructRouter(): void {
		const router = Chuoi.newRoute("/attempts");

		router.endpoint().get()
			.schema({
				meta: CredentialsMetaSchema,
				query: AttemptsQuerySchema,
				response: AttemptsResourceSchema,
			})
			.handle(async (data) => {
				return await new GetAttemptsQuery()
					.withCredentials(data.meta)
					.handle(data.query);
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