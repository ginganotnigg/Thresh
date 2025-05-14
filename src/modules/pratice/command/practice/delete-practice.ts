import sequelize from "../../../../configs/orm/sequelize/sequelize";
import PracticeTest from "../../../../domain/models/practice_test";
import Test from "../../../../domain/models/test";
import Question from "../../../../domain/models/question";
import { TestId } from "../../../../domain/schema/id.schema";
import { DomainError } from "../../../../controller/errors/domain.error";

export async function commandDeletePractice(authorId: string, testId: string): Promise<void> {
	const transaction = await sequelize.transaction();

	try {
		// Find the practice test by test ID
		const practiceTest = await PracticeTest.findOne({
			where: {
				testId,
			},
			include: [{
				model: Test,
				required: true,
			}],
			transaction
		});

		if (!practiceTest) {
			throw new DomainError(`Practice test with ID ${testId} not found`);
		}

		if (practiceTest.Test!.authorId !== authorId) {
			throw new DomainError(`Test with ID ${testId} does not belong to author with ID ${authorId}`);
		}

		// Delete associated questions
		await Question.destroy({
			where: { testId: testId },
			transaction
		});

		// Delete the practice test
		await practiceTest.destroy({ transaction });

		// Delete the base test
		await Test.destroy({
			where: { id: testId },
			transaction
		});

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}