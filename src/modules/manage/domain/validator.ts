import { TestCreateBody, TestUpdateBody } from "../schemas/request";

export function validateCreateTestParam(param: TestCreateBody) {
	if (param.tagIds.length === 0) {
		throw new Error("Test must have some tags");
	}
	if (param.questions.length === 0) {
		throw new Error("Test must have some questions");
	}
	for (const question of param.questions) {
		if (question.options.length === 0) {
			throw new Error("Question options are required");
		}
		if (question.correctOption < 0 || question.correctOption >= question.options.length) {
			throw new Error("Question correct option is invalid");
		}
	}
}

export function validateUpdateTestParam(param: TestUpdateBody) {
	if (param.tagIds?.length === 0) {
		throw new Error("Test must have some tags");
	}
	if (param.questions) {
		if (param.questions.length === 0) {
			throw new Error("Test must have some questions");
		}
		for (const question of param.questions) {
			if (question.options.length === 0) {
				throw new Error("Question options are required");
			}
			if (question.correctOption < 0 || question.correctOption >= question.options.length) {
				throw new Error("Question correct option is invalid");
			}
		}
	}
}