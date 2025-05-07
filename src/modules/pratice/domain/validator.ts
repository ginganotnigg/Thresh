import { DomainError } from "../../../controller/errors/domain.error";
import { TestCreateBody, TestUpdateBody } from "../schema/core.schema";

export function validateCreateTestParam(param: TestCreateBody) {
	if (param.tagIds.length === 0) {
		throw new DomainError("Test must have some tags");
	}
	if (param.questions.length === 0) {
		throw new DomainError("Test must have some questions");
	}
	for (const question of param.questions) {
		if (question.options.length === 0) {
			throw new DomainError("Question options are required");
		}
		if (question.correctOption < 0 || question.correctOption >= question.options.length) {
			throw new DomainError("Question correct option is invalid");
		}
	}
}

export function validateUpdateTestParam(param: TestUpdateBody) {
	if (param.tagIds?.length === 0) {
		throw new DomainError("Test must have some tags");
	}
	if (param.questions) {
		if (param.questions.length === 0) {
			throw new DomainError("Test must have some questions");
		}
		for (const question of param.questions) {
			if (question.options.length === 0) {
				throw new DomainError("Question options are required");
			}
			if (question.correctOption < 0 || question.correctOption >= question.options.length) {
				throw new DomainError("Question correct option is invalid");
			}
		}
	}
}