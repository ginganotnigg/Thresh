import { Transaction } from "sequelize";
import sequelize from "../../../configs/orm/sequelize/sequelize";
import Question from "../../models/question";
import Test from "../../models/test";
import { CreateTestType } from "../../schema/create.schema";

export class TestRepo {
	static async createTest(param: CreateTestType, transaction: Transaction): Promise<{ testId: string }> {
		try {
			const test = await Test.create({
				...param.test,
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
}


