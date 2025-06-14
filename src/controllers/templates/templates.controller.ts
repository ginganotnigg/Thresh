import { Chuoi } from "../../library/caychuoijs";
import { TemplatesQuerySchema } from "../../modules/pratice/schema";
import { ControllerBase } from "../../shared/controller/controller.base";
import { PagingSchema } from "../../shared/controller/schemas/base";
import { TemplateIdParamsSchema } from "../../shared/controller/schemas/params";
import { PostTemplateBodySchema, PutTemplateBodySchema } from "./body.schema";
import { TemplateResourceSchema, TemplatesResourceSchema } from "./resouce.schema";

export class TemplatesController extends ControllerBase {
	constructRouter(): void {
		const router = Chuoi.newRoute("/templates");

		router.endpoint().get()
			.schema({
				query: TemplatesQuerySchema,
				response: TemplatesResourceSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Templates"] });

		router.endpoint().get("/:templateId")
			.schema({
				params: TemplateIdParamsSchema,
				response: TemplateResourceSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Templates"] });

		router.endpoint().post()
			.schema({
				body: PostTemplateBodySchema,
				response: TemplateIdParamsSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Templates"] });

		router.endpoint().put("/:templateId")
			.schema({
				params: TemplateIdParamsSchema,
				body: PutTemplateBodySchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Templates"] });

		router.endpoint().delete("/:templateId")
			.schema({
				params: TemplateIdParamsSchema,
			})
			.handle(async (data) => {
			})
			.build({ tags: ["Templates"] });
	}
}