import { db } from "../../../configs/orm/kysely/db";
import { TestId } from "../../../shared/query/id/id.schema";
import { QuestionToDo } from "../../../shared/resource/question.schema";
import { QueryWithCredentialsBase } from "../base/query.base";
import { ParticipantPolicyFactory } from "../policy/participant/ParticipantPolicyFactory";

export class QuestionsToDoQuery extends QueryWithCredentialsBase<TestId, QuestionToDo[]> {
	async query(param: TestId): Promise<QuestionToDo[]> {
		const policyFactory = new ParticipantPolicyFactory(this.credentials);
		const policy = await policyFactory.createFromTestId(param.testId);
		policy.verify();

		const questions = await db.selectFrom("Questions")
			.select([
				"id",
				"testId",
				"points",
				"options",
				"text"
			])
			.where("testId", "=", param.testId)
			.execute();

		return questions.map(q => ({
			...q,
			options: q.options as string[],
		}));
	}
}