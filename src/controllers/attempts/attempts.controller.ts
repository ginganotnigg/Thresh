import { Chuoi } from "../../library/caychuoijs";
import { ControllerBase } from "../../shared/controller/controller.base";
import { CredentialsMetaSchema } from "../../shared/controller/schemas/meta";
import { AttemptIdParamsSchema } from "../../shared/controller/schemas/params";
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
import { scheduleOngoingAttempts } from "./init/schedule-ongoing-attempts";
import { z } from "zod";
import { AttemptTimeoutHandler } from "./handlers/AttemptTimeoutHandler";
import { AttemptTimeOutEvent } from "../../domain/_events/AttemptTimeOutEvent";
import { EventHandlerBase } from "../../shared/handler/usecase.base";
import { AttemptCreatedHandler } from "./handlers/AttemptCreatedHandler";
import { AttemptCreatedEvent } from "../../domain/_events/AttemptCreatedEvent";
import { AttemptSubmittedEvent } from "../../domain/_events/AttemptSubmittedEvent";
import { ScoreLongAnswerEvent } from "../../domain/_events/ScoreLongAnswer";
import { ScoreLongAnswerHandler } from "./handlers/ScoreLongAnswerHandler";
import { AttemptSubmittedHandler } from "./handlers/AttemptSubmittedHandler";

export class AttemptsController extends ControllerBase {
	private readonly attemptTimeoutHandler: EventHandlerBase<AttemptTimeOutEvent>;
	private readonly attemptCreatedHandler: EventHandlerBase<AttemptCreatedEvent>;
	private readonly attemptEndedHandler: EventHandlerBase<AttemptSubmittedEvent>;
	private readonly scoreLongAnswerHandler: EventHandlerBase<ScoreLongAnswerEvent>;

	constructor() {
		super();
		this.attemptTimeoutHandler = new AttemptTimeoutHandler();
		this.attemptTimeoutHandler.registerEvent(AttemptTimeOutEvent);
		this.attemptCreatedHandler = new AttemptCreatedHandler();
		this.attemptCreatedHandler.registerEvent(AttemptCreatedEvent);
		this.attemptEndedHandler = new AttemptSubmittedHandler();
		this.attemptEndedHandler.registerEvent(AttemptSubmittedEvent);
		this.scoreLongAnswerHandler = new ScoreLongAnswerHandler();
		this.scoreLongAnswerHandler.registerEvent(ScoreLongAnswerEvent);

	}

	async constructRouter(): Promise<void> {
		await scheduleOngoingAttempts();

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
				response: GetAttemptQueryResponseSchema,
			})
			.handle(async (data) => {
				return await new GetAttemptQueryHandler()
					.withId(data.params.attemptId)
					.withCredentials(data.meta)
					.handle();
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
					.handle();
			})
			.build({ tags: ["Attempts"] });

		router.endpoint().post()
			.schema({
				meta: CredentialsMetaSchema,
				body: PostAttemptsBodySchema,
				response: z.object({ attemptId: z.string() })
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