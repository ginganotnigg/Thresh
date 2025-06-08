import { db } from "../../../configs/orm/kysely/db";
import { TestId } from "../../../shared/query/id/id.schema";
import { TestAggregate } from "../../../shared/resource/test.schema";
import { QueryWithCredentialsBase } from "../base/query.base";
import { ParticipantPolicyFactory } from "../policy/participant/ParticipantPolicyFactory";

export class TestAggregateQuery extends QueryWithCredentialsBase<TestId, TestAggregate> {

	async query(param: TestId): Promise<TestAggregate> {
		const test = await db.selectFrom("Tests")
			.selectAll()
			.where("id", "=", param.testId)
			.executeTakeFirst();

		if (test == null) {
			throw new Error(`Test with id ${param.testId} not found.`);
		}
		if (test.mode !== "exam" && test.mode !== "practice") {
			throw new Error(`Invalid test mode: ${test.mode}`);
		}
		const participantPolicyFactory = new ParticipantPolicyFactory(this.credentials);
		const policy = await participantPolicyFactory.createFromTest({
			testId: test.id,
			authorId: test.authorId,
			mode: test.mode,
		});
		policy.verify();
		const res = await db.selectFrom("Questions")
			.select(eb => [
				eb.fn.countAll<number>().as("numberOfQuestions"),
				eb.fn.sum<number>("points").as("totalPoints"),
			])
			.where("testId", "=", test.id)
			.executeTakeFirstOrThrow();
		return {
			numberOfQuestions: res.numberOfQuestions,
			totalPoints: res.totalPoints,
		};
	}
}