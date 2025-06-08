import sequelize from "../../../configs/orm/sequelize/sequelize";
import { DomainError } from "../../../shared/controller/errors/domain.error";
import { CredentialsMeta } from "../../../shared/controller/schemas/meta";
import ExamParticipants from "../../../infrastructure/models/exam_participants";
import ExamTest from "../../../infrastructure/models/exam_test";
import Test from "../../../infrastructure/models/test";
import { ExamPolicy } from "../../../domain/policy/exam.policy";
import { Op } from "sequelize";
import { TestRepo } from "../../../infrastructure/write/test.repo";
import { CreateExamBody, UpdateExamBody } from "../schema";

export class ExamsWrite {
	private readonly examPolicy: ExamPolicy;

	private constructor(
		private readonly test: Test,
		private readonly credentials: CredentialsMeta,
	) {
		this.examPolicy = new ExamPolicy(test, credentials);
	}

	static async load(testId: string, credentials: CredentialsMeta): Promise<ExamsWrite> {
		const test = await Test.findByPk(testId, {
			include: [{
				model: ExamTest,
				required: true,
				include: [{
					model: ExamParticipants,
				}],
			}]
		});
		if (!test || !test.ExamTest || !test.ExamTest.ExamParticipants) {
			throw new DomainError(`Exam test not found`);
		}
		return new ExamsWrite(test, credentials);
	}

	static async create(param: CreateExamBody, credentials: CredentialsMeta) {
		const transaction = await sequelize.transaction();
		try {
			const now = new Date();
			const duplicateTest = await ExamTest.findOne({
				where: {
					roomId: param.exam.roomId,
					openDate: {
						[Op.lte]: now,
					},
					closeDate: {
						[Op.gte]: now,
					},
				},
			});
			if (duplicateTest) {
				throw new DomainError(`Room ID already exists in currently open exam (${duplicateTest.openDate.toDateString()} - ${duplicateTest.closeDate.toDateString()}). Please use a different room ID.`);
			}
			const { testId } = await TestRepo.createTest(credentials, {
				test: param.test,
				questions: param.questions,
			}, transaction);

			await ExamTest.create({
				...param.exam,
				testId: testId,
			}, { transaction });

			await transaction.commit();
			return { testId: testId };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async join(password: string | null | undefined): Promise<void> {
		const participant = await ExamParticipants.findOne({
			where: {
				candidateId: this.credentials.userId,
				testId: this.test.id,
			}
		})
		if (participant) {
			throw new DomainError(`You are already a participant of this exam`);
		}
		this.examPolicy.checkAllowedToJoin(password || null);
		await ExamParticipants.create({
			testId: this.test.id,
			candidateId: this.credentials.userId,
		});
	}

	async edit(param: UpdateExamBody): Promise<void> {
		await this.examPolicy.checkIsAllowedToEdit();
		const transaction = await sequelize.transaction();
		try {
			await TestRepo.updateTest(param, transaction);
			await ExamTest.update({
				...param.exam,
			}, {
				where: {
					testId: this.test.id,
				},
				transaction,
			});
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	async delete(): Promise<void> {
		await this.examPolicy.checkIsAllowedToDelete();
		const transaction = await sequelize.transaction();
		try {
			await TestRepo.deleteTest(this.test.id, transaction);
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}