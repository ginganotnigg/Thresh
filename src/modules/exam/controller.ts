import { z } from "zod";
import { Chuoi } from "../../library/caychuoijs";
import { ExamTestInfoSchema } from "../../domain/schema/info.schema";
import { TestIdParamsSchema } from "../../controller/schemas/params";
import { CreateExamSchema } from "./schema";
import { CredentialsMetaSchema } from "../../controller/schemas/meta";
import { ExamsRead } from "./usecase/exams.read";
import { ExamRead } from "./usecase/exam.read";
import { PagedSchema } from "../../controller/schemas/base";
import { ExamsWrite } from "./usecase/exams.write";
import { TestsQuerySchema } from "../../domain/schema/query.schema";

export default function controllerExam() {
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
			query: z.object({
				roomId: z.string(),
			}),
			response: ExamTestInfoSchema,
		})
		.handle(async (data) => {
			return await ExamsRead.load().find(data.query.roomId);
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

	router.endpoint().post()
		.schema({
			meta: CredentialsMetaSchema,
			body: CreateExamSchema,
			response: z.object({
				testId: z.string(),
			}),
		})
		.handle(async (data) => {
			const { body } = data;
			return await ExamsWrite.create(body);
		})
		.build({
			tags: ["Exam"],
		});

	router.endpoint().post("/join")
		.schema({
			meta: CredentialsMetaSchema,
			body: z.object({
				testId: z.string(),
				password: z.string(),
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