import sequelize from "../../../../configs/orm/sequelize/sequelize";
import { DomainError } from "../../../../controller/errors/domain.error";
import { CredentialsMeta } from "../../../../controller/schemas/meta";
import Template from "../../../../domain/models/template";
import { CreateTemplateBody, UpdateTemplateBody } from "../../schema";

export class TemplatesWrite {
	private constructor(
		private readonly credentials: CredentialsMeta,
	) { }

	static load(credentials: CredentialsMeta): TemplatesWrite {
		return new TemplatesWrite(credentials);
	}

	async create(body: CreateTemplateBody) {
		const transaction = await sequelize.transaction();
		try {
			const template = await Template.create({
				...body,
				userId: this.credentials.userId,
			}, { transaction });

			await transaction.commit();

			return { templateId: template.id };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async update(templateId: string, body: UpdateTemplateBody) {
		const transaction = await sequelize.transaction();
		try {
			const template = await Template.findByPk(templateId, { transaction });
			if (!template) {
				throw new DomainError(`Template with id ${templateId} not found`);
			}
			if (template.userId !== this.credentials.userId) {
				throw new DomainError(`You are not the owner of this template`);
			}
			await template.update({
				...body,
			}, { transaction });

			await template.save();
			await transaction.commit();
			return { success: true };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async delete(templateId: string) {
		const transaction = await sequelize.transaction();
		try {
			const template = await Template.findByPk(templateId, { transaction });
			if (!template) {
				throw new DomainError(`Template with id ${templateId} not found`);
			}
			if (template.userId !== this.credentials.userId) {
				throw new DomainError(`You are not the owner of this template`);
			}
			await template.destroy({ transaction });
			await transaction.commit();
			return { success: true };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}