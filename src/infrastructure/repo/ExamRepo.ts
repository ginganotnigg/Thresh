import { ExamAggregate } from "../../domain/ExamAggregate";
import { RepoBase } from "./RepoBase";
import { db } from "../../configs/orm/kysely/db";
import sequelize from "../../configs/orm/sequelize/sequelize";
import { DomainError } from "../../shared/errors/domain.error";
import { ExamPersistence } from "../../domain/_mappers/ExamMapper";
import ExamTest from "../models/exam_test";
import ExamParticipants from "../models/exam_participants";

export class ExamRepo extends RepoBase<ExamAggregate> {
	async getById(id: string): Promise<ExamAggregate> {
		// Get exam test data
		const examTest = await db
			.selectFrom("ExamTests")
			.where("testId", "=", id)
			.selectAll()
			.executeTakeFirst();

		if (!examTest) {
			throw new DomainError(`Exam with id ${id} not found`);
		}

		// Get participant IDs for this exam
		const participants = await db
			.selectFrom("ExamParticipants")
			.where("testId", "=", id)
			.select("candidateId")
			.execute();

		const participantIds = participants.map(p => p.candidateId);

		// Map to persistence format
		const persistence: ExamPersistence = {
			testId: examTest.testId,
			roomId: examTest.roomId,
			openDate: examTest.openDate,
			closeDate: examTest.closeDate,
			numberOfAttemptsAllowed: examTest.numberOfAttemptsAllowed,
			numberOfParticipants: examTest.numberOfParticipants,
			isPublic: Boolean(examTest.isPublic),
			isAnswerVisible: Boolean(examTest.isAnswerVisible),
			isAllowedToSeeOtherResults: Boolean(examTest.isAllowedToSeeOtherResults),
			password: examTest.password,
		};

		return ExamAggregate.fromPersistence(persistence, participantIds);
	}

	protected async _save(agg: ExamAggregate): Promise<void> {
		const { exam, addedParticipants, removedParticipants } = agg.toPersistence();
		const transaction = await sequelize.transaction();

		try {
			// Upsert exam test data
			await ExamTest.upsert({
				testId: exam.testId,
				roomId: exam.roomId,
				password: exam.password,
				numberOfAttemptsAllowed: exam.numberOfAttemptsAllowed,
				numberOfParticipants: exam.numberOfParticipants,
				isAnswerVisible: exam.isAnswerVisible,
				isAllowedToSeeOtherResults: exam.isAllowedToSeeOtherResults,
				isPublic: exam.isPublic,
				openDate: exam.openDate,
				closeDate: exam.closeDate,
			}, { transaction });

			// Add new participants
			if (addedParticipants.length > 0) {
				await ExamParticipants.bulkCreate(
					addedParticipants.map(candidateId => ({
						testId: exam.testId,
						candidateId,
					})),
					{
						transaction,
						updateOnDuplicate: ["testId", "candidateId"], // Update if exists
						ignoreDuplicates: true, // Avoid errors if participant already exists
					}
				);
			}

			// Remove participants
			if (removedParticipants.length > 0) {
				await ExamParticipants.destroy({
					where: {
						testId: exam.testId,
						candidateId: removedParticipants,
					},
					transaction,
				});
			}

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}
}