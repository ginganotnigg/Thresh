import { z } from "zod";
import { Chuoi } from "../../library/caychuoijs";
import queryFind from "./query/find";
import commandJoin from "./command/join";
import { ExamTestInfoSchema } from "../../domain/schema/info.schema";
import { TestIdParamsSchema } from "../../controller/schemas/params";
import { queryExamTest } from "./query/exam-test";

export default function controllerExam() {
	const router = Chuoi.newRoute();

	router.endpoint().get("/exam-test/find")
		.schema({
			query: z.object({
				roomId: z.string(),
			}),
			response: ExamTestInfoSchema,
		})
		.handle(async (data) => {
			return await queryFind(data.query.roomId);
		})
		.build({
			tags: ["Exam"],
			summary: "Find exam",
		});

	router.endpoint().get("/exam-test/:testId")
		.schema({
			params: TestIdParamsSchema,
			response: ExamTestInfoSchema,
		})
		.handle(async (data) => {
			const { params: { testId } } = data;
			return await queryExamTest(testId);
		})
		.build({
			tags: ["Exam"],
			summary: "Get exam test by ID",
		});

	router.endpoint().post("/exam-test/join")
		.schema({
			body: z.object({
				testId: z.string(),
				password: z.string(),
				candidateId: z.string(),
			}),
		})
		.handle(async (data) => {
			const { body: { testId, password, candidateId } } = data;
			return await commandJoin({
				testId,
				password,
				candidateId,
			});
		})
		.build({
			tags: ["Exam"],
			summary: "Join exam with password (optional)",
		});
}