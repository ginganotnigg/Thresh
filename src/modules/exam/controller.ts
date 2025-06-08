import { z } from "zod";
import { Chuoi } from "../../library/caychuoijs";
import { TestIdParamsSchema } from "../../shared/controller/schemas/params";
import { CreateExamBodySchema, UpdateExamBodySchema } from "./schema";
import { CredentialsMetaSchema } from "../../shared/controller/schemas/meta";
import { ExamsRead } from "./usecase/exams.read";
import { ExamRead } from "./usecase/exam.read";
import { PagedSchema } from "../../shared/controller/schemas/base";
import { ExamsWrite } from "./usecase/exams.write";
import { TestsQuerySchema } from "../../shared/query/filter/test.query-schema";
import { QuestionCoreSchema } from "../../shared/resource/question.schema";
import { QuestionToDoSchema } from "../../shared/resource/question.schema";
import { TestQuestionsAggregateSchema } from "../../shared/resource/test.schema";
import { ExamTestInfoSchema } from "../../shared/resource/exam.schema";

export default function examController() {
	const router = Chuoi.newRoute("/exams");

	router.endpoint().get()
		.schema({
			meta: CredentialsMetaSchema,
			query: TestsQuerySchema,
			response: PagedSchema(ExamTestInfoSchema),
		})
		.handle(async (data) => {
			const { query, meta } = data;
			return await (ExamsRead.load()).getSelf(query, meta);
		})
		.build({
			tags: ["Exam"],
		});

	router.endpoint().get("/find")
		.schema({
			meta: CredentialsMetaSchema,
			query: z.object({
				roomId: z.string(),
			}),
			response: ExamTestInfoSchema.extend({
				hasJoined: z.boolean(),
			}),
		})
		.handle(async (data) => {
			return await ExamsRead.load().find(data.query.roomId, data.meta);
		})
		.build({
			tags: ["Exam"],
		});

	router.endpoint().get("/:testId")
		.schema({
			params: TestIdParamsSchema,
			response: ExamTestInfoSchema,
		})
		.handle(async (data) => {
			const { params: { testId } } = data;
			return await ExamsRead.load().get(testId);
		})
		.build({
			tags: ["Exam"],
		});

	router.endpoint().get("/:testId/aggregate")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			response: z.object({
				numberOfQuestions: z.number(),
				totalPoints: z.number(),
			}),
		})
		.handle(async (data) => {
			const { params: { testId } } = data;
			return await (await ExamRead.load(testId, data.meta)).getAggregate();
		})
		.build({
			tags: ["Exam"],
		});

	router.endpoint().get("/:testId/participants")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			query: z.object({
				page: z.number().optional().default(1),
				perPage: z.number().optional().default(10),
			}),
			response: PagedSchema(z.string()),
		})
		.handle(async (data) => {
			const { params: { testId }, query: { page, perPage } } = data;
			return await (await ExamRead.load(testId, data.meta)).getParticipants({
				page,
				perPage,
			});
		})
		.build({
			tags: ["Exam"],
		})

	router.endpoint().get("/:testId/questions-to-do")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			response: z.array(QuestionToDoSchema),
		})
		.handle(async (data) => {
			const { params: { testId } } = data;
			return await (await ExamRead.load(testId, data.meta)).getQuestionsToDo();
		})
		.build({
			tags: ["Exam"],
		});

	router.endpoint().get("/:testId/questions-with-answer")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			response: z.array(QuestionCoreSchema),
		})
		.handle(async (data) => {
			const { params: { testId } } = data;
			return await (await ExamRead.load(testId, data.meta)).getQuestionsWithAnswers();
		})
		.build({
			tags: ["Exam"],
		});

	router.endpoint().get("/:testId/questions-aggregate")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			response: z.array(TestQuestionsAggregateSchema),
		})
		.handle(async (data) => {
			const { params: { testId } } = data;
			return await (await ExamRead.load(testId, data.meta)).getTestQuestionsAggregate();
		})
		.build({
			tags: ["Exam"],
		});

	router.endpoint().post()
		.schema({
			meta: CredentialsMetaSchema,
			body: CreateExamBodySchema,
			response: z.object({
				testId: z.string(),
			}),
		})
		.handle(async (data) => {
			const { body } = data;
			return await ExamsWrite.create(body, data.meta);
		})
		.build({
			tags: ["Exam"],
		});

	router.endpoint().put("/:testId")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
			body: UpdateExamBodySchema,
		})
		.handle(async (data) => {
			const { params: { testId }, body } = data;
			return await (await ExamsWrite.load(testId, data.meta)).edit(body);
		})
		.build({
			tags: ["Exam"],
		});

	router.endpoint().delete("/:testId")
		.schema({
			meta: CredentialsMetaSchema,
			params: TestIdParamsSchema,
		})
		.handle(async (data) => {
			const { params: { testId } } = data;
			return (await ExamsWrite.load(testId, data.meta)).delete();
		})
		.build({
			tags: ["Exam"],
		});

	router.endpoint().post("/join")
		.schema({
			meta: CredentialsMetaSchema,
			body: z.object({
				testId: z.string(),
				password: z.string().optional(),
			}),
		})
		.handle(async (data) => {
			const { body: { testId, password } } = data;
			return await (await (ExamsWrite.load(testId, data.meta))).join(password);
		})
		.build({
			tags: ["Exam"],
			summary: "Join exam with password (optional)",
		});
}