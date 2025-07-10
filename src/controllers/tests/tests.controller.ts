import { Chuoi } from "../../library/caychuoijs";
import { ControllerBase } from "../../shared/controller/controller.base";
import { TestIdParamsSchema } from "../../shared/controller/schemas/params";
import { GetTestsQuerySchema } from "./uc_query/get-tests/param";
import { GetTestsResponseSchema } from "./uc_query/get-tests/response";
import { GetTestsQueryHandler } from "./uc_query/get-tests/handler";
import { CredentialsMetaSchema } from "../../shared/controller/schemas/meta";
import { FindTestQuerySchema } from "./uc_query/find-exam/param";
import { FindTestResponseSchema } from "./uc_query/find-exam/response";
import { FindTestQueryHandler } from "./uc_query/find-exam/handler";
import { GetTestQueryParamSchema } from "./uc_query/get-test/param";
import { GetTestResponseSchema } from "./uc_query/get-test/response";
import { GetTestQueryHandler } from "./uc_query/get-test/handler";
import { GetTestAttemptsQuerySchema } from "./uc_query/get-test-attempts/param";
import { GetTestAttemptsResponseSchema } from "./uc_query/get-test-attempts/response";
import { GetTestAttemptsQueryHandler } from "./uc_query/get-test-attempts/handler";
import { GetTestParticipantsQuerySchema } from "./uc_query/get-test-participants/param";
import { GetTestParticipantsResponseSchema } from "./uc_query/get-test-participants/response";
import { GetTestParticipantsQueryHandler } from "./uc_query/get-test-participants/handler";
import { PostTestBodySchema } from "./uc_command/post-test/body";
import { PostTestHandler } from "./uc_command/post-test/handler";
import { PutTestBodySchema } from "./uc_command/put-test/body";
import { PutTestHandler } from "./uc_command/put-test/handler";
import { DeleteTestHandler } from "./uc_command/delete-test/handler";
import { PostExamParticipantBodySchema } from "./uc_command/post-exam-participant/body";
import { PostExamParticipantHandler } from "./uc_command/post-exam-participant/handler";
import { DeleteExamParticipantBodySchema } from "./uc_command/delete-exam-participant/body";
import { DeleteExamParticipantHandler } from "./uc_command/delete-exam-participant/handler";
import { z } from "zod";
import { GetTestQuestionsParamSchema } from "./uc_query/get-test-questions/param";
import { GetTestQuestionsResponseSchema } from "./uc_query/get-test-questions/response";
import { GetTestQuestionsHandler } from "./uc_query/get-test-questions/handler";
import { GetSuggestedTestsQuerySchema } from "./uc_query/get-suggested-tests/param";
import { GetSuggestedTestsResponseSchema } from "./uc_query/get-suggested-tests/response";
import { GetSuggestedTestsQueryHandler } from "./uc_query/get-suggested-tests/handler";
import { GetTestParticipantResponseSchema } from "./uc_query/get-test-participant/response";
import { GetTestParticipantQueryHandler } from "./uc_query/get-test-participant/handler";
import e from "express";
import { SuggestRoomIdHandler } from "./uc_query/suggest-roomid/handler";

export class TestsController extends ControllerBase {
	async constructRouter(): Promise<void> {
		const router = Chuoi.newRoute("/tests");

		router.endpoint().get()
			.schema({
				meta: CredentialsMetaSchema,
				query: GetTestsQuerySchema,
				response: GetTestsResponseSchema,
			})
			.handle(async (data) => {
				return await new GetTestsQueryHandler()
					.withCredentials(data.meta)
					.handle(data.query);
			})
			.build({ tags: ["Tests"] });

		router.endpoint().get("/suggested")
			.schema({
				meta: CredentialsMetaSchema,
				query: GetSuggestedTestsQuerySchema,
				response: GetSuggestedTestsResponseSchema,
			})
			.handle(async (data) => {
				return await new GetSuggestedTestsQueryHandler()
					.withCredentials(data.meta)
					.handle(data.query);
			})
			.build({ tags: ["Tests"] });

		router.endpoint().get("/find-by-room")
			.schema({
				meta: CredentialsMetaSchema,
				query: FindTestQuerySchema,
				response: FindTestResponseSchema,
			})
			.handle(async (data) => {
				return await new FindTestQueryHandler()
					.withCredentials(data.meta)
					.handle(data.query);
			})
			.build({ tags: ["Tests"] });

		router.endpoint().get("/suggest-roomid")
			.schema({
				query: z.object({
					startDate: z.coerce.date(),
					endDate: z.coerce.date(),
				}),
				response: z.object({
					roomId: z.string(),
				}),
			})
			.handle(async (data) => {
				return await new SuggestRoomIdHandler()
					.handle(data.query);
			})
			.build({
				tags: ["Tests"],
				description: "Suggest a unique roomId for an exam based on the provided date range",
			});

		router.endpoint().get("/:testId")
			.schema({
				meta: CredentialsMetaSchema,
				params: TestIdParamsSchema,
				query: GetTestQueryParamSchema,
				response: GetTestResponseSchema,
			})
			.handle(async (data) => {
				return await new GetTestQueryHandler()
					.withCredentials(data.meta)
					.withId(data.params.testId)
					.handle(data.query);
			})
			.build({ tags: ["Tests"] });

		router.endpoint().get("/:testId/questions")
			.schema({
				meta: CredentialsMetaSchema,
				params: TestIdParamsSchema,
				query: GetTestQuestionsParamSchema,
				response: GetTestQuestionsResponseSchema,
			})
			.handle(async (data) => {
				return await new GetTestQuestionsHandler()
					.withCredentials(data.meta)
					.withId(data.params.testId)
					.handle(data.query);
			})
			.build({ tags: ["Tests"] });

		router.endpoint().get("/:testId/attempts")
			.schema({
				meta: CredentialsMetaSchema,
				params: TestIdParamsSchema,
				query: GetTestAttemptsQuerySchema,
				response: GetTestAttemptsResponseSchema,
			})
			.handle(async (data) => {
				return await new GetTestAttemptsQueryHandler()
					.withCredentials(data.meta)
					.withId(data.params.testId)
					.handle(data.query);
			})
			.build({ tags: ["Tests"] });

		router.endpoint().get("/:testId/participants")
			.schema({
				meta: CredentialsMetaSchema,
				params: TestIdParamsSchema,
				query: GetTestParticipantsQuerySchema,
				response: GetTestParticipantsResponseSchema,
			})
			.handle(async (data) => {
				return await new GetTestParticipantsQueryHandler()
					.withCredentials(data.meta)
					.withId(data.params.testId)
					.handle(data.query);
			})
			.build({ tags: ["Tests"] });

		router.endpoint().get("/:testId/participants/:participantId")
			.schema({
				meta: CredentialsMetaSchema,
				params: z.object({
					testId: z.string(),
					participantId: z.string(),
				}),
				response: GetTestParticipantResponseSchema,
			})
			.handle(async (data) => {
				return await new GetTestParticipantQueryHandler()
					.withCredentials(data.meta)
					.withId({
						testId: data.params.testId,
						candidateId: data.params.participantId,
					})
					.handle();
			})
			.build({ tags: ["Tests"] });

		router.endpoint().post()
			.schema({
				meta: CredentialsMetaSchema,
				body: PostTestBodySchema,
				response: z.object({
					testId: z.string(),
				})
			})
			.handle(async (data) => {
				return await new PostTestHandler()
					.withCredentials(data.meta)
					.handle(data.body);
			})
			.build({ tags: ["Tests"] });

		router.endpoint().put("/:testId")
			.schema({
				meta: CredentialsMetaSchema,
				params: TestIdParamsSchema,
				body: PutTestBodySchema,
			})
			.handle(async (data) => {
				return await new PutTestHandler()
					.withCredentials(data.meta)
					.withId(data.params.testId)
					.handle(data.body);
			})
			.build({ tags: ["Tests"] });

		router.endpoint().delete("/:testId")
			.schema({
				meta: CredentialsMetaSchema,
				params: TestIdParamsSchema,
			})
			.handle(async (data) => {
				return await new DeleteTestHandler()
					.withCredentials(data.meta)
					.withId(data.params.testId)
					.handle();
			})
			.build({ tags: ["Tests"] });

		router.endpoint().post("/:testId/participants")
			.schema({
				meta: CredentialsMetaSchema,
				params: TestIdParamsSchema,
				body: PostExamParticipantBodySchema,
			})
			.handle(async (data) => {
				return await new PostExamParticipantHandler()
					.withCredentials(data.meta)
					.withId(data.params.testId)
					.handle(data.body);
			})
			.build({
				tags: ["Tests"],
				description: "Add a participant to an exam",
			});

		router.endpoint().delete("/:testId/participants")
			.schema({
				meta: CredentialsMetaSchema,
				params: TestIdParamsSchema,
				body: DeleteExamParticipantBodySchema,
			})
			.handle(async (data) => {
				return await new DeleteExamParticipantHandler()
					.withCredentials(data.meta)
					.withId(data.params.testId)
					.handle(data.body);
			})
			.build({
				tags: ["Tests"],
				description: "Remove a participant from an exam",
			});
	}
}