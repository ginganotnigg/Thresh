import { TestCreateParam, TestUpdateParam } from "../schemas/param";
import Test from "../../../models/test";
import Question from "../../../models/question";
import sequelize from "../../../configs/sequelize/database";
import { removeNullFields } from "../../../common/utils/object";

export class CommandService {
	constructor() { }

	async createTest(param: TestCreateParam) {
		const { questions, tagIds, ...testInfo } = param;
		const transaction = await sequelize.transaction();
		try {
			const test = await Test.create({
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

	async updateTest(param: TestUpdateParam) {
		const { questions, tagIds, ...testInfo } = param;
		const notNullTestInfo = removeNullFields(testInfo);
		const transaction = await sequelize.transaction();
		try {
			const test = await Test.findByPk(testInfo.id, { transaction });
			if (test == null) {
				throw new Error("Test not found");
			}
			await Test.update({
				...notNullTestInfo,
			}, {
				where: { id: testInfo.id },
				transaction,
			});
			if (tagIds != null) {
				await test?.setTags(tagIds, { transaction });
			}
			if (questions != null) {
				await Question.destroy({
					where: { testId: testInfo.id },
					transaction,
				});
				await Question.bulkCreate(questions.map((question) => ({
					...question,
					testId: testInfo.id,
				})), { transaction });
			}
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async deleteTest(id: number) {
		const transaction = await sequelize.transaction();
		try {
			const test = await Test.findByPk(id, { transaction });
			if (test == null) {
				throw new Error("Test not found");
			}
			await test.destroy({ transaction });
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}