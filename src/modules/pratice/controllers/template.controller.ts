import { z } from "zod";
import { Chuoi } from "../../../library/caychuoijs";
import { TemplatesQuerySchema } from "../schema";
import { TemplateCoreSchema } from "../../../shared/resource/template.schema";
import { CreateTemplateBodySchema } from "../schema";
import { UpdateTemplateBodySchema } from "../schema";
import { CredentialsMetaSchema } from "../../../shared/schemas/meta";
import { PagedSchema } from "../../../shared/controller/schemas/base";
import { TemplatesRead } from "../usecase/templates/templates.read";
import { TemplatesWrite } from "../usecase/templates/templates.write";

export default function controllerTemplate() {
	const router = Chuoi.newRoute("/templates");

	router.endpoint().get()
		.schema({
			meta: CredentialsMetaSchema,
			query: TemplatesQuerySchema,
			response: PagedSchema(TemplateCoreSchema),
		})
		.handle(async data => {
			return await TemplatesRead.load(data.meta).getSelf(data.query);
		}).build({ tags: ['Template'] });

	router.endpoint().get('/:templateId')
		.schema({
			meta: CredentialsMetaSchema,
			params: z.object({
				templateId: z.string(),
			}),
			response: TemplateCoreSchema,
		})
		.handle(async data => {
			return await TemplatesRead.load(data.meta).get(data.params.templateId);
		}).build({ tags: ['Template'] });

	router.endpoint().post()
		.schema({
			meta: CredentialsMetaSchema,
			body: CreateTemplateBodySchema,
			response: z.object({
				templateId: z.string(),
			}),
		})
		.handle(async data => {
			return await TemplatesWrite.load(data.meta).create(data.body);
		}).build({ tags: ['Template'] });

	router.endpoint().put('/:templateId')
		.schema({
			meta: CredentialsMetaSchema,
			params: z.object({
				templateId: z.string(),
			}),
			body: UpdateTemplateBodySchema,
		})
		.handle(async data => {
			await TemplatesWrite.load(data.meta).update(data.params.templateId, data.body);
		}).build({ tags: ['Template'] });

	router.endpoint().delete('/:templateId')
		.schema({
			meta: CredentialsMetaSchema,
			params: z.object({
				templateId: z.string(),
			}),
		}).handle(async data => {
			await TemplatesWrite.load(data.meta).delete(data.params.templateId);
		}).build({ tags: ['Template'] });
}