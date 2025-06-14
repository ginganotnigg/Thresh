import sequelize from "../../../../configs/orm/sequelize/sequelize";
import { DomainError } from "../../../../controllers/shared/errors/domain.error";
import { CredentialsMeta } from "../../../../controllers/shared/schemas/meta";
import Feedback from "../../../../infrastructure/models/feedback";
import PracticeTest from "../../../../infrastructure/models/practice_test";
import Test from "../../../../infrastructure/models/test";
import { CreateFeedbackBody, UpdateFeedbackBody } from "../../schema";

export class FeedbacksWrite {
	private constructor(
		private readonly credentials: CredentialsMeta,
		private readonly test: Test,
	) { }

	static async load(testId: string, credentials: CredentialsMeta): Promise<FeedbacksWrite> {
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
		return new FeedbacksWrite(credentials, test);
	}

	async submit(body: CreateFeedbackBody) {
		const transaction = await sequelize.transaction();
		try {
			await Feedback.upsert({
				...body,
				testId: this.test.id,
			}, { transaction });

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async delete() {
		const transaction = await sequelize.transaction();
		try {
			const feedback = await Feedback.findByPk(this.test.id, { transaction });
			if (!feedback) {
				throw new DomainError(`Feedback with of test with id ${this.test.id} not found`);
			}
			await feedback.destroy({ transaction });

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}