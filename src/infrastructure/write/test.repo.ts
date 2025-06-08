import { Transaction } from "sequelize";
import Question from "../models/question";
import Test from "../models/test";
import { CreateTestBody, UpdateTestBody } from "../../shared/resource/test.schema";
import { CredentialsMeta } from "../../shared/controller/schemas/meta";

export class TestRepo {
	static async createTest(credentials: CredentialsMeta, param: CreateTestBody, transaction: Transaction): Promise<{ testId: string }> {
		const test = await Test.create({
			...param.test,
			authorId: credentials.userId,
			id: undefined,
		}, { transaction });

		await Question.bulkCreate(param.questions.map((question) => ({
			...question,
			testId: test.get("id"),
		})), { transaction });

		return { testId: test.get("id") as string };
	}

	static async updateTest(
		param: UpdateTestBody,
		transaction: Transaction,
	): Promise<void> {
		const testId = param.testId;
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
	}

	static async deleteTest(testId: string, transaction: Transaction): Promise<void> {
		await Question.destroy({
			where: { testId },
			transaction,
		});

		await Test.destroy({
			where: { id: testId },
			transaction,
		});
	}
}


