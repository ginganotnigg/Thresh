import { db } from "../../../../configs/orm/kysely/db";
import { AttemptStatusType } from "../../../../domain/enum";
import { DomainError } from "../../../shared/errors/domain.error";
import { TestAttemptsAggregate } from "../test-attempts-agg/TestAttemptsAggregate";
import { jsonArrayFrom } from "kysely/helpers/mysql"
import { AttemptEntity } from "../test-attempts-agg/AttemptEntity";
import { PracticeAttemptsAggregate } from "../test-attempts-agg/PracticeAttemptsAggregate";
import { ExamAttemptsAggregate } from "../test-attempts-agg/ExamAttemptsAggregate";

export class GetTestAttemptsRepo {
	private static async getAttemptsOfTest(testId: string): Promise<AttemptEntity[]> {
		const attempts = await db
			.selectFrom("Attempts as a")
			.where("a.TestId", "=", testId)
			.selectAll()
			.execute();

		if (attempts.length === 0) {
			throw new DomainError(`No attempts found for test with ID ${testId}`);
		}
		return attempts.map((attempt) => AttemptEntity.fromPersistence({
			id: attempt.id,
			candidateId: attempt.candidateId,
			testId: attempt.TestId!,
			hasEnded: attempt.hasEnded === 1 ? true : false,
			order: attempt.order,
			secondsSpent: attempt.secondsSpent,
			status: attempt.status,
		}));
	}

	static async getTest(testId: string): Promise<TestAttemptsAggregate> {
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
					.where("a.TestId", "=", "t.id")
					.where("a.status", "=", inprogressStatus)
					.select("a.id")
					.as("activeAttemptId"),
				jsonArrayFrom(eb
					.selectFrom("ExamParticipants as ep")
					.where("ep.testId", "=", "t.id")
					.select("ep.candidateId")
				).as("participantList"),
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
				attempts,
				test.authorId,
			)
		} else if (test.mode === "EXAM") {
			testAgg = new ExamAttemptsAggregate(
				test.id,
				attempts,
				new Date(test.openDate!),
				new Date(test.closeDate!),
				test.participantList.map((p) => p.candidateId),
				test.numberOfAttemptsAllowed!
			)
		}
		if (!testAgg) {
			throw new DomainError(`Test with ID ${testId} has an invalid mode`);
		}
		return testAgg;
	}
}