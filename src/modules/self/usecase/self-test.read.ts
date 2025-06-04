import { DomainError } from "../../../shared/controller/errors/domain.error";
import { CredentialsMeta } from "../../../shared/controller/schemas/meta";
import Test from "../../../infrastructure/models/test";
import { TestQueryRepo } from "../../../infrastructure/read/test.query-repo";
import { TestAggregate } from "../../../domain/schema/aggregate.schema";
import { QuestionCore } from "../../../domain/schema/core.schema";
import { TestInfo } from "../../../domain/schema/info.schema";
import { QuestionToDo } from "../../../domain/schema/variants.schema";

export class SelfTestRead {
	private checkSelf() {
		if (this.test.authorId !== this.credentials.userId) {
			throw new DomainError("You are not the author of this test");
		}
	}

	private constructor(
		private readonly test: Test,
		private readonly credentials: CredentialsMeta,
	) { }

	static async load(testId: string, credentials: CredentialsMeta): Promise<SelfTestRead> {
		const test = await Test.findByPk(testId);
		if (!test) {
			throw new DomainError("Test not found");
		}
		return new SelfTestRead(test, credentials);
	}

	getTest(): TestInfo {
		this.checkSelf();
		return this.test;
	}

	async getTestAggregate(): Promise<TestAggregate> {
		this.checkSelf();
		return await TestQueryRepo.getTestAggregate(this.test.id);
	}

	async getTestQuestionsToDo(): Promise<QuestionToDo[]> {
		this.checkSelf();
		const questions = await TestQueryRepo.getQuestionsToDo(this.test.id);
		return questions;
	}

	async getTestQuestionsWithAnswers(): Promise<QuestionCore[]> {
		this.checkSelf();
		const questions = await TestQueryRepo.getQuestions(this.test.id);
		return questions;
	}
}