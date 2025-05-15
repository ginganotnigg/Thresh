import { z } from "zod";
import { Chuoi } from "../../../library/caychuoijs";
import { TemplatesQuerySchema } from "../schema";
import { TemplateCoreSchema } from "../../../domain/schema/core.schema";
import { CreateTemplateBodySchema } from "../schema";
import { UpdateTemplateBodySchema } from "../schema";
import { CredentialsMetaSchema } from "../../../controller/schemas/meta";
import { PagedSchema } from "../../../controller/schemas/base";
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

	router.endpoint().put()
		.schema({
			meta: CredentialsMetaSchema,
			body: UpdateTemplateBodySchema,
		})
		.handle(async data => {
			await TemplatesWrite.load(data.meta).update(data.body);
		}).build({ tags: ['Template'] });

	router.endpoint().delete('/templates/:templateId')
		.schema({
			meta: CredentialsMetaSchema,
			params: z.object({
				templateId: z.string(),
			}),
		}).handle(async data => {
			await TemplatesWrite.load(data.meta).delete(data.params.templateId);
		}).build({ tags: ['Template'] });
}