import sequelize from "../../../configs/orm/sequelize/sequelize";
import { DomainError } from "../../../controller/errors/domain.error";
import { CredentialsMeta } from "../../../controller/schemas/meta";
import ExamParticipants from "../../../domain/models/exam_participants";
import ExamTest from "../../../domain/models/exam_test";
import Test from "../../../domain/models/test";
import { ExamPolicy } from "../../../domain/policy/exam.policy";
import { Op } from "sequelize";
import { TestRepo } from "../../../domain/repo/test/test.repo";
import { CreateExamType } from "../schema";

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
			throw new DomainError(`Test not found`);
		}
		return new ExamsWrite(test, credentials);
	}

	static async create(param: CreateExamType) {
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
				throw new DomainError("Room ID already exists");
			}
			const { testId } = await TestRepo.createTest({
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
}