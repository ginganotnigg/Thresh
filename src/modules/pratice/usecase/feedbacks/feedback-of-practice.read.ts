import { DomainError } from "../../../../shared/controller/errors/domain.error";
import { CredentialsMeta } from "../../../../shared/controller/schemas/meta";
import Feedback from "../../../../infrastructure/models/feedback";
import PracticeTest from "../../../../infrastructure/models/practice_test";
import Test from "../../../../infrastructure/models/test";
import { FeedbackCore } from "../../../../shared/resource/practice.schema";

export class FeedbackOfPracticeRead {
	private constructor(
		private readonly credentials: CredentialsMeta,
		private readonly test: Test,
	) { }

	static async load(testId: string, credentials: CredentialsMeta): Promise<FeedbackOfPracticeRead> {
		const test = await Test.findByPk(testId, {
			include: [{
				model: PracticeTest,
				required: true,
			}],
		});
		if (!test) {
			throw new DomainError(`Test with id ${testId} not found`);
		}
		if (test.authorId !== credentials.userId) {
			throw new DomainError(`You are not the author of this test`);
		}
		return new FeedbackOfPracticeRead(credentials, test);
	}

	async get(): Promise<FeedbackCore | null> {
		const feedback = await Feedback.findOne({
			where: {
				practiceTestId: this.test.id,
			},
		});
		return feedback;
	}
} 