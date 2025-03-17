import { TestCreateBody, TestUpdateBody } from "../schemas/request";
import sequelize from "../../../configs/orm/sequelize";
import { removeNullFields } from "../../../utils/object";
import Test from "../../../domain/models/test";
import { DomainErrorResponse } from "../../../controller/errors/domain.error";
import Question from "../../../domain/models/question";

export class CommandService {
	static async createTest(managerId: string, param: TestCreateBody) {
		const { questions, tagIds, ...testInfo } = param;
		const transaction = await sequelize.transaction();
		try {
			const test = await Test.create({
				managerId,
				...testInfo,
			}, { transaction });
			await test.setTags(tagIds, { transaction });
			await Question.bulkCreate(questions.map((question) => ({
				testId: test.id,
				...question,
			})), { transaction });
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	static async updateTest(testId: number, param: TestUpdateBody) {
		const { questions, tagIds, ...testInfo } = param;
		const notNullTestInfo = removeNullFields(testInfo);
		const transaction = await sequelize.transaction();
		try {
			const test = await Test.findByPk(testId, { transaction });
			if (test == null) {
				throw new DomainErrorResponse("Test not found");
			}
			await Test.update({
				...notNullTestInfo,
			}, {
				where: { id: testId },
				transaction,
			});
			if (tagIds != null) {
				await test?.setTags(tagIds, { transaction });
			}
			if (questions != null) {
				await Question.destroy({
					where: { testId },
					transaction,
				});
				await Question.bulkCreate(questions.map((question) => ({
					...question,
					testId,
				})), { transaction });
			}
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	static async deleteTest(id: number) {
		const transaction = await sequelize.transaction();
		try {
			const test = await Test.findByPk(id, { transaction });
			if (test == null) {
				throw new DomainErrorResponse("Test not found");
			}
			await test.destroy({ transaction });
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}