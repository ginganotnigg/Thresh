import PracticeTest from "../../../../domain/models/practice_test";
import sequelize from "../../../../configs/orm/sequelize/sequelize";
import { TestRepo } from "../../../../domain/repo/test/test.repo";
import Test from "../../../../domain/models/test";
import { DomainError } from "../../../../controller/errors/domain.error";
import { CredentialsMeta } from "../../../../controller/schemas/meta";
import { PracticePolicy } from "../../../../domain/policy/practice.policy";
import { CreatePracticeBody } from "../../schema";

export class PracticeWrite {
	private readonly practicePolicy: PracticePolicy;

	private constructor(
		private readonly test: Test,
		private readonly credentials: CredentialsMeta,
	) {
		if (!test || !test.PracticeTest) {
			throw new DomainError(`Practice test not found`);
		}
		this.practicePolicy = new PracticePolicy(test, credentials);
	}

	static async load(testId: string, credentials: CredentialsMeta): Promise<PracticeWrite> {
		const test = await Test.findByPk(testId, {
			include: [{
				model: PracticeTest,
				required: true,
			}]
		});
		if (!test || !test.PracticeTest || test.authorId !== credentials.userId) {
			throw new DomainError(`Practice test not found`);
		}
		return new PracticeWrite(test, credentials);
	}

	static async create(params: CreatePracticeBody, credentials: CredentialsMeta): Promise<{ testId: string }> {
		const transaction = await sequelize.transaction();
		try {
			const { testId } = await TestRepo.createTest(credentials, {
				test: {
					...params.test,
					mode: "practice",
				},
				questions: params.questions,
			}, transaction);

			await PracticeTest.create({
				testId,
				...params.practice,
			}, { transaction });

			await transaction.commit();
			return { testId };
		} catch (error) {
			console.log("error", error);
			await transaction.rollback();
			throw error;
		}
	}

	async delete(): Promise<void> {
		this.practicePolicy.checkAuthor();
		const transaction = await sequelize.transaction();
		try {
			await TestRepo.deleteTest(this.test.id, transaction);
			await PracticeTest.destroy({
				where: { testId: this.test.id },
				transaction,
			});
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}