import { z } from "zod";
import { Chuoi } from "../../library/caychuoijs";
import { ControllerBase } from "../../shared/controller/controller.base";
import { CredentialsMetaSchema } from "../../shared/schemas/meta";
import { TemplateIdParamsSchema } from "../../shared/schemas/params";
import { TemplateCrudService } from "./crud";
import { GetTemplateResponseSchema, GetTemplatesQuerySchema, GetTemplatesResponseSchema, PostTemplateBodySchema, PutTemplateBodySchema } from "./schema";

export class TemplatesController extends ControllerBase {
	async constructRouter(): Promise<void> {
		const router = Chuoi.newRoute("/templates");

		router.endpoint().get()
			.schema({
				meta: CredentialsMetaSchema,
				query: GetTemplatesQuerySchema,
				response: GetTemplatesResponseSchema,
			})
			.handle(async (data) => {
				return await TemplateCrudService.load(data.meta).getAll(data.query);
			})
			.build({ tags: ["Templates"] });

		router.endpoint().get("/:templateId")
			.schema({
				meta: CredentialsMetaSchema,
				params: TemplateIdParamsSchema,
				response: GetTemplateResponseSchema,
			})
			.handle(async (data) => {
				return await TemplateCrudService.load(data.meta).getById(data.params.templateId);
			})
			.build({ tags: ["Templates"] });

		router.endpoint().post()
			.schema({
				meta: CredentialsMetaSchema,
				body: PostTemplateBodySchema,
				response: z.object({
					templateId: z.string(),
				}),
			})
			.handle(async (data) => {
				return await TemplateCrudService.load(data.meta).create(data.body);
			})
			.build({ tags: ["Templates"] });

		router.endpoint().put("/:templateId")
			.schema({
				meta: CredentialsMetaSchema,
				params: TemplateIdParamsSchema,
				body: PutTemplateBodySchema,
			})
			.handle(async (data) => {
				return await TemplateCrudService.load(data.meta).update(data.params.templateId, data.body);
			})
			.build({ tags: ["Templates"] });

		router.endpoint().delete("/:templateId")
			.schema({
				meta: CredentialsMetaSchema,
				params: TemplateIdParamsSchema,
			})
			.handle(async (data) => {
				return await TemplateCrudService.load(data.meta).delete(data.params.templateId);
			})
			.build({ tags: ["Templates"] });
	}
}