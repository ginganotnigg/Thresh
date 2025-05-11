import { z } from "zod";
import { PagedSchema, PagingSchema } from "../../../controller/schemas/base";
import PromptTemplate from "../../../domain/models/prompt_template";
import { Op } from "sequelize";

export const QueryTemplatesParamSchema = z.object({
	searchName: z.string().optional(),
}).merge(PagingSchema);

export type QueryTemplatesParam = z.infer<typeof QueryTemplatesParamSchema>;

export const QueryTemplatesResponseSchema = PagedSchema(z.object({
	id: z.string(),
	name: z.string(),
	title: z.string(),
	description: z.string(),
	difficulty: z.string(),
	tags: z.array(z.string()),
	numberOfQuestions: z.number(),
	numberOfOptions: z.number(),
	outlines: z.array(z.string()),
}));

export type QueryTemplatesResponse = z.infer<typeof QueryTemplatesResponseSchema>;

export default async function queryTemplates(params: QueryTemplatesParam): Promise<QueryTemplatesResponse> {
	const { searchName, page, perPage } = params;
	const { count, rows: templates } = await PromptTemplate.findAndCountAll({
		where: {
			...(searchName ? {
				name: {
					[Op.like]: `%${searchName}%`,
				},
			} : {}),
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