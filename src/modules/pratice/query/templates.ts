import { z } from "zod";
import { PagedSchema, PagingSchema } from "../../../controller/schemas/base";
import Template from "../../../domain/models/template";
import { Op } from "sequelize";
import { TemplateCoreSchema } from "../../../domain/schema/core.schema";

export const GetTemplatesQuerySchema = z.object({
	searchName: z.string().optional(),
}).merge(PagingSchema);

export type GetTemplateQuery = z.infer<typeof GetTemplatesQuerySchema>;

export const GetTemplatesResponseSchema = PagedSchema(TemplateCoreSchema);

export type GetTemplatesResponse = z.infer<typeof GetTemplatesResponseSchema>;

export default async function queryTemplates(userId: string, params: GetTemplateQuery): Promise<GetTemplatesResponse> {
	const { searchName, page, perPage } = params;
	const { count, rows: templates } = await Template.findAndCountAll({
		where: {
			userId,
			...(searchName && {
				name: {
					[Op.like]: `%${searchName}%`,
				},
			}),
		},
		limit: perPage,
		offset: (page - 1) * perPage,
		order: [['createdAt', 'DESC']],
	});

	return {
		data: templates.map((template) => template.get()),
		page,
		perPage,
		total: count,
		totalPages: Math.ceil(count / perPage),
	}
}