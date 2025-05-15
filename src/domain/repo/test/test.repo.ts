import { Transaction } from "sequelize";
import Question from "../../models/question";
import Test from "../../models/test";
import { CreateTestBody, UpdateTestBody } from "../../schema/create.schema";
import { CredentialsMeta } from "../../../controller/schemas/meta";

export class TestRepo {
	static async createTest(credentials: CredentialsMeta, param: CreateTestBody, transaction: Transaction): Promise<{ testId: string }> {
		try {
			const test = await Test.create({
				...param.test,
				authorId: credentials.userId,
				id: undefined,
			}, { transaction });

			await Question.bulkCreate(param.questions.map((question) => ({
				...question,
				testId: test.get("id"),
			})), { transaction });

			await transaction.commit();
			return { testId: test.get("id") as string };
		}
		catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	static async updateTest(
		param: UpdateTestBody,
		transaction: Transaction,
	): Promise<void> {
		const testId = param.testId;
		try {
			await Question.destroy({
				where: { testId },
				transaction,
			});

			await Test.update(param.test, {
				where: { id: testId },
				transaction,
			});

			await Question.bulkCreate(param.questions.map((question) => ({
				...question,
				testId,
			})), { transaction });

			await transaction.commit();
		}
		catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	static async deleteTest(testId: string, transaction: Transaction): Promise<void> {
		try {
			await Question.destroy({
				where: { testId },
				transaction,
			});

			await Test.destroy({
				where: { id: testId },
				transaction,
			});

			await transaction.commit();
		}
		catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}


