import { z } from "zod";
import sequelize from "../../../../configs/orm/sequelize/sequelize";
import Template from "../../../../domain/models/template";
import { DomainError } from "../../../../controller/errors/domain.error";

export const UpdateTemplateSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	difficulty: z.string().optional(),
	tags: z.array(z.string()).optional(),
	numberOfQuestions: z.number().optional(),
	numberOfOptions: z.number().optional(),
	outlines: z.array(z.string()).optional(),
});

export type UpdateTemplate = z.infer<typeof UpdateTemplateSchema>;

export async function commandUpdateTemplate(params: UpdateTemplate): Promise<{ success: boolean }> {
	const {
		id,
		...updateData
	} = params;

	const transaction = await sequelize.transaction();
	try {
		const template = await Template.findByPk(id, { transaction });

		if (!template) {
			await transaction.rollback();
			throw new DomainError(`Template with id ${id} not found`);
		}

		await template.update(updateData, { transaction });

		await transaction.commit();
		return { success: true };
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}