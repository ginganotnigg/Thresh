import { db } from "../../configs/orm/kysely/db";
import { DomainError } from "../../shared/errors/domain.error";
import { TestAttemptsAggregate } from "../../domain/test-attempts-agg/TestAttemptsAggregate";
import { jsonArrayFrom } from "kysely/helpers/mysql"
import { AttemptEntity } from "../../domain/test-attempts-agg/AttemptEntity";
import { PracticeAttemptsAggregate } from "../../domain/test-attempts-agg/PracticeAttemptsAggregate";
import { ExamAttemptsAggregate } from "../../domain/test-attempts-agg/ExamAttemptsAggregate";
import sequelize from "../../configs/orm/sequelize/sequelize";
import Attempt from "../models/attempt";
import { AttemptStatusType } from "../../shared/enum";
import { RepoBase } from "./RepoBase";

export class TestAttemptsRepo extends RepoBase<TestAttemptsAggregate> {
	private async getAttemptsOfTest(testId: string): Promise<AttemptEntity[]> {
		const raws = await db
			.selectFrom("Attempts as a")
			.innerJoin("Tests as t", "t.id", "a.testId")
			.where("a.testId", "=", testId)
			.select(["t.mode as mode"])
			.selectAll("a")
			.execute();
		return raws.map((raw) => AttemptEntity.load({
			id: raw.id,
			candidateId: raw.candidateId,
			testId: raw.testId!,
			hasEnded: raw.hasEnded === 1 ? true : false,
			order: raw.order,
			secondsSpent: raw.secondsSpent,
			status: raw.status,
			answers: [], // Assuming answers are not needed here, or you can fetch them if required
			createdAt: raw.createdAt!,

			test: {
				mode: raw.mode,
			},
		}));
	}

	async getTest(testId: string): Promise<TestAttemptsAggregate> {
		const inprogressStatus: AttemptStatusType = "IN_PROGRESS";

		const test = await db
			.selectFrom("Tests as t")
			.where("id", "=", testId)
			.leftJoin("PracticeTests as pt", "pt.testId", "t.id")
			.leftJoin("ExamTests as et", "et.testId", "t.id")
			.selectAll()
			.select((eb) => [
				eb
					.selectFrom("Attempts as a")
					.where("a.testId", "=", "t.id")
					.where("a.status", "=", inprogressStatus)
					.select("a.id")
					.as("activeAttemptId"),
			])
			.executeTakeFirst();
		if (!test) {
			throw new DomainError(`Test with ID ${testId} not found`);
		}
		const attempts = await this.getAttemptsOfTest(test.id);

		let testAgg: TestAttemptsAggregate | undefined = undefined;

		if (test.mode === "PRACTICE") {
			testAgg = new PracticeAttemptsAggregate(
				test.id,
				test.minutesToAnswer,
				attempts,
				test.authorId,
			)
		} else if (test.mode === "EXAM") {
			const participantList = await db
				.selectFrom("ExamParticipants as ep")
				.where("ep.testId", "=", test.id)
				.select("ep.candidateId")
				.execute();
			testAgg = new ExamAttemptsAggregate(
				test.id,
				test.minutesToAnswer,
				attempts,
				new Date(test.openDate!),
				new Date(test.closeDate!),
				participantList.map((p) => p.candidateId),
				test.numberOfAttemptsAllowed!
			)
		}
		if (!testAgg) {
			throw new DomainError(`Test with ID ${testId} has an invalid mode`);
		}
		return testAgg;
	}

	async _save(test: TestAttemptsAggregate): Promise<void> {
		const { newAttempt, modifedAttmepts, deletedAttempts } = test.getPersistenceData();
		const transaction = await sequelize.transaction();
		try {
			if (newAttempt) {
				await Attempt.create(newAttempt, { transaction });
			}
			if (modifedAttmepts.length > 0) {
				await Attempt.bulkCreate(modifedAttmepts, {
					updateOnDuplicate: ["candidateId", "hasEnded", "order", "secondsSpent", "status"],
					transaction,
				});
			}
			if (deletedAttempts.length > 0) {
				await Attempt.destroy({
					where: { id: deletedAttempts },
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