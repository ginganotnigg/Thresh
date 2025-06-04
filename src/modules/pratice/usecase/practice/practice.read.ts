import { DomainError } from "../../../../shared/controller/errors/domain.error";
import { CredentialsMeta } from "../../../../shared/controller/schemas/meta";
import PracticeTest from "../../../../infrastructure/models/practice_test";
import Test from "../../../../infrastructure/models/test";
import { PracticePolicy } from "../../../../domain/policy/practice.policy";
import { TestQueryRepo } from "../../../../infrastructure/read/test.query-repo";
import { TestAggregate } from "../../../../domain/schema/aggregate.schema";
import { QuestionCore } from "../../../../domain/schema/core.schema";
import { QuestionToDo } from "../../../../domain/schema/variants.schema";

export class PracticeRead {
	private readonly practicePolicy: PracticePolicy;

	private constructor(
		private readonly test: Test,
		private readonly credentials: CredentialsMeta,
	) {
		this.practicePolicy = new PracticePolicy(this.test, this.credentials);
	}

	static async load(testId: string, credentials: CredentialsMeta): Promise<PracticeRead> {
		const test = await Test.findByPk(testId, {
			include: [{
				model: PracticeTest,
				required: true,
			}],
		});
		if (!test) {
			throw new DomainError(`Test not found`);
		}
		return new PracticeRead(test, credentials);
	}

	async getQuestionsToDo(): Promise<QuestionToDo[]> {
		this.practicePolicy.checkAuthor();
		return await TestQueryRepo.getQuestionsToDo(this.test.id);
	}

	async getQuestionsWithAnswers(): Promise<QuestionCore[]> {
		this.practicePolicy.checkAuthor();
		return await TestQueryRepo.getQuestions(this.test.id);
	}

	async getAggregate(): Promise<TestAggregate> {
		this.practicePolicy.checkAuthor();
		const testAggregate = await TestQueryRepo.getTestAggregate(this.test.id);
		return testAggregate;
	}
}