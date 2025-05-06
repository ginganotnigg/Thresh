import { z } from "zod";
import sequelize from "../../../configs/orm/sequelize";
import PracticeTest from "../../../domain/models/practice_test";
import Test from "../../../domain/models/test";
import Question from "../../../domain/models/question";
import { TestId } from "../schema/query.schema";

export async function deletePracticeCommand(params: TestId): Promise<void> {
	const { testId: id } = params;
	const transaction = await sequelize.transaction();

	try {
		// Find the practice test by test ID
		const practiceTest = await PracticeTest.findOne({
			where: { testId: id },
			transaction
		});

		if (!practiceTest) {
			throw new Error(`Practice test with ID ${id} not found`);
		}

		// Delete associated questions
		await Question.destroy({
			where: { testId: id },
			transaction
		});

		// Delete the practice test
		await practiceTest.destroy({ transaction });

		// Delete the base test
		await Test.destroy({
			where: { id },
			transaction
		});

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}