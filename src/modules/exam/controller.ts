import { z } from "zod";
import { Chuoi } from "../../library/caychuoijs";
import queryFind from "./query/find";
import commandJoin from "./command/join";

export default function controllerExam() {
	const router = Chuoi.newRoute("/exam");

	router.endpoint().get("/find")
		.schema({
			query: z.object({
				roomId: z.string(),
			}),
		})
		.handle(async (data) => {
			return await queryFind(data.query.roomId);
		})
		.build({
			tags: ["Exam"],
			summary: "Find exam",
		});

	router.endpoint().post("/join")
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
		});
}