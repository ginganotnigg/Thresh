import { z } from "zod";
import { Chuoi } from "../../library/caychuoijs";
import { ControllerBase } from "../../shared/controller/controller.base";
import { TestIdParamsSchema } from "../../shared/controller/schemas/params";
import { PostTestBodySchema, PutTestBodySchema } from "./body.schema";
import { TestQuerySchema, TestsQuerySchema } from "./query.schema";
import { TestResourceSchema, TestsResourceSchema } from "./resource.schema";

export class TestsController extends ControllerBase {
	constructRouter(): void {
		const router = Chuoi.newRoute("/tests");

		router.endpoint().get()
			.schema({
				query: TestsQuerySchema,
				response: TestsResourceSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Tests"] });

		router.endpoint().get("/:testId")
			.schema({
				params: TestIdParamsSchema,
				query: TestQuerySchema,
				response: TestResourceSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Tests"] });

		router.endpoint().get("/find-by-roomId")
			.schema({
				query: z.object({
					roomId: z.string().min(1, "Room ID is required")
				}),
				response: TestResourceSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Tests"] });

		router.endpoint().post()
			.schema({
				body: PostTestBodySchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Tests"] });

		router.endpoint().put("/:testId")
			.schema({
				params: TestIdParamsSchema,
				body: PutTestBodySchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Tests"] });

		router.endpoint().delete("/:testId")
			.schema({
				params: TestIdParamsSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Tests"] });



	}
}