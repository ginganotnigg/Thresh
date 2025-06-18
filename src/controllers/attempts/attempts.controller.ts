import { Chuoi } from "../../library/caychuoijs";
import { ControllerBase } from "../../shared/controller/controller.base";
import { CredentialsMetaSchema } from "../../shared/schemas/meta";
import { AttemptIdParamsSchema } from "../../shared/schemas/params";
import { PostAttemptsBodySchema } from "./uc_command/post-attempts/body";
import { PostAttemptAnswersBodySchema } from "./uc_command/post-attempt-answers/body";
import { GetAttemptQueryParamSchema } from "./uc_query/get-attempt-query/param";
import { GetAttemptsQueryParamSchema } from "./uc_query/get-attempts-query/param";
import { GetAttemptQueryResponseSchema } from "./uc_query/get-attempt-query/response";
import { GetAttemptsResourceResponseSchema } from "./uc_query/get-attempts-query/response";
import { GetAttemptsQueryHandler } from "./uc_query/get-attempts-query/handler";
import { GetAttemptQueryHandler } from "./uc_query/get-attempt-query/handler";
import { GetAttemptAnswersResponseSchema } from "./uc_query/get-attempt-answers-query/response";
import { GetAttemptAnswersQueryHandler } from "./uc_query/get-attempt-answers-query/handler";
import { PostAttemptsHandler } from "./uc_command/post-attempts/handler";
import { PostAttemptAnswersHandler } from "./uc_command/post-attempt-answers/handler";
import { PatchAttemptSubmitHandler } from "./uc_command/patch-attempt-submit/handler";

export class AttemptsController extends ControllerBase {
	constructRouter(): void {
		const router = Chuoi.newRoute("/attempts");

		router.endpoint().get()
			.schema({
				meta: CredentialsMetaSchema,
				query: GetAttemptsQueryParamSchema,
				response: GetAttemptsResourceResponseSchema,
			})
			.handle(async (data) => {
				return await new GetAttemptsQueryHandler()
					.withCredentials(data.meta)
					.handle(data.query);
			})
			.build({ tags: ["Attempts"] });

		router.endpoint().get("/:attemptId")
			.schema({
				meta: CredentialsMetaSchema,
				params: AttemptIdParamsSchema,
				query: GetAttemptQueryParamSchema,
				response: GetAttemptQueryResponseSchema,
			})
			.handle(async (data) => {
				return await new GetAttemptQueryHandler()
					.withId(data.params.attemptId)
					.withCredentials(data.meta)
					.handle({
						...data.params,
						...data.query,
					});
			})
			.build({ tags: ["Attempts"] });

		router.endpoint().get("/:attemptId/answers")
			.schema({
				meta: CredentialsMetaSchema,
				params: AttemptIdParamsSchema,
				response: GetAttemptAnswersResponseSchema
			})
			.handle(async (data) => {
				return await new GetAttemptAnswersQueryHandler()
					.withId(data.params.attemptId)
					.withCredentials(data.meta)
					.handle({});
			})
			.build({ tags: ["Attempts"] });

		router.endpoint().post()
			.schema({
				meta: CredentialsMetaSchema,
				body: PostAttemptsBodySchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Attempts"] });

		router.endpoint().post()
			.schema({
				meta: CredentialsMetaSchema,
				body: PostAttemptsBodySchema,
			})
			.handle(async (data) => {
				return await new PostAttemptsHandler()
					.withCredentials(data.meta)
					.handle(data.body);
			})
			.build({ tags: ["Attempts"] });

		router.endpoint().post("/:attemptId/answers")
			.schema({
				meta: CredentialsMetaSchema,
				params: AttemptIdParamsSchema,
				body: PostAttemptAnswersBodySchema,
			})
			.handle(async (data) => {
				return await new PostAttemptAnswersHandler()
					.withCredentials(data.meta)
					.withId(data.params.attemptId)
					.handle(data.body);
			})
			.build({ tags: ["Attempts"] });

		router.endpoint().patch("/:attemptId/submit")
			.schema({
				meta: CredentialsMetaSchema,
				params: AttemptIdParamsSchema,
			})
			.handle(async (data) => {
				return await new PatchAttemptSubmitHandler()
					.withCredentials(data.meta)
					.withId(data.params.attemptId)
					.handle();
			})
			.build({ tags: ["Attempts"] });
	}
}