import { z } from "zod";
import sequelize from "../../../../configs/orm/sequelize/sequelize";
import Template from "../../../../domain/models/template";

export const CreateTemplateSchema = z.object({
	name: z.string(),
	title: z.string(),
	description: z.string(),
	difficulty: z.string(),
	tags: z.array(z.string()),
	numberOfQuestions: z.number(),
	numberOfOptions: z.number(),
	outlines: z.array(z.string()),
});

export type CreateTemplate = z.infer<typeof CreateTemplateSchema>;

export async function commandCreateTemplate(params: CreateTemplate): Promise<void> {
	const {
		name,
		title,
		description,
		difficulty,
		tags,
		numberOfQuestions,
		numberOfOptions,
		outlines,
	} = params;

	const transaction = await sequelize.transaction();
	try {
		const promptTemplate = await Template.create({
			name,
			title,
			description,
			difficulty,
			tags,
			numberOfQuestions,
			numberOfOptions,
			outlines,
		}, { transaction });

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}