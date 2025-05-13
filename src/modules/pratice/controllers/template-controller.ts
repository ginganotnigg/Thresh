import { z } from "zod";
import { Chuoi } from "../../../library/caychuoijs";
import queryTemplates, { GetTemplatesResponseSchema, GetTemplatesQuerySchema } from "../query/templates";
import { TemplateCoreSchema } from "../../../domain/schema/core.schema";
import { commandCreateTemplate, CreateTemplateSchema } from "../command/templates/create-template";
import { commandDeleteTemplate } from "../command/templates/delete-template";
import { commandUpdateTemplate, UpdateTemplateSchema } from "../command/templates/update-template";

export default function controllerTemplate() {
	const router = Chuoi.newRoute();

	router.endpoint().get('/templates')
		.schema({
			query: GetTemplatesQuerySchema,
			response: GetTemplatesResponseSchema,
		})
		.handle(async data => {
			return await queryTemplates(data.query);
		}).build({ tags: ['Template'] });

	router.endpoint().post('/templates')
		.schema({
			body: CreateTemplateSchema,
		})
		.handle(async data => {
			await commandCreateTemplate(data.body);
		}).build({ tags: ['Template'] });

	router.endpoint().put('/templates')
		.schema({
			body: UpdateTemplateSchema,
		})
		.handle(async data => {
			await commandUpdateTemplate(data.body);
		}).build({ tags: ['Template'] });

	router.endpoint().delete('/templates/:templateId')
		.schema({
			params: z.object({
				templateId: z.string(),
			}),
		}).handle(async data => {
			await commandDeleteTemplate({ id: data.params.templateId });
		}).build({ tags: ['Template'] });
}