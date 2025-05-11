import { z } from "zod";
import sequelize from "../../../../configs/orm/sequelize/sequelize";
import PromptTemplate from "../../../../domain/models/prompt_template";
import { DomainError } from "../../../../controller/errors/domain.error";

export const DeleteTemplateSchema = z.object({
	id: z.string(),
});

export type DeleteTemplate = z.infer<typeof DeleteTemplateSchema>;

export async function commandDeleteTemplate(params: DeleteTemplate): Promise<{ success: boolean }> {
	const { id } = params;

	const transaction = await sequelize.transaction();
	try {
		const template = await PromptTemplate.findByPk(id, { transaction });

		if (!template) {
			await transaction.rollback();
			throw new DomainError(`Template with id ${id} not found`);
		}

		await template.destroy({ transaction });

		await transaction.commit();
		return { success: true };
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}