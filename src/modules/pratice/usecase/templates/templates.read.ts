import { Op } from "sequelize";
import { CredentialsMeta } from "../../../../shared/controller/schemas/meta";
import Template from "../../../../infrastructure/models/template";
import { TemplateCore } from "../../../../shared/resource/template.schema";
import { TemplatesQuery } from "../../schema";
import { Paged } from "../../../../shared/controller/schemas/base";

export class TemplatesRead {
	private constructor(
		private readonly credentials: CredentialsMeta,
	) { }

	static load(credentials: CredentialsMeta): TemplatesRead {
		return new TemplatesRead(credentials);
	}

	async getSelf(query: TemplatesQuery): Promise<Paged<TemplateCore>> {
		const { searchName, page, perPage } = query;

		const { rows: templates, count } = await Template.findAndCountAll({
			where: {
				userId: this.credentials.userId,
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

	async get(templateId: string): Promise<TemplateCore> {
		const template = await Template.findByPk(templateId);
		if (!template) {
			throw new Error("Template not found");
		}
		return template.get();
	}
}