import { DomainError } from "../../../controller/errors/domain.error";
import Template from "../../../domain/models/template";
import { TemplateCore } from "../../../domain/schema/core.schema";

export default async function queryTemplate(userId: string, templateId: string): Promise<TemplateCore> {
	const template = await Template.findOne({
		where: {
			userId,
			id: templateId,
		},
	});
	if (!template) {
		throw new DomainError('Template not found');
	}
	return template.get();
}