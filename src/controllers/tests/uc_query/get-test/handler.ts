import { db } from "../../../../configs/orm/kysely/db";
import { buildTestQuery, parseResult } from "../../../../schemas/query/shared/build-test-query";
import { DomainError } from "../../../../shared/errors/domain.error";
import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { GetTestResponse } from "./response";

export class GetTestQueryHandler extends QueryHandlerBase<void, GetTestResponse> {
	async handle(): Promise<GetTestResponse> {
		const testId = this.getId();
		const query = buildTestQuery()
			.where("t.id", "=", testId)
			;
		const res = await query.executeTakeFirst();
		if (!res) {
			throw new DomainError("Test not found");
		}
		let participants: string[] = [];
		if (res.mode === "EXAM") {
			participants = (await db
				.selectFrom("ExamParticipants")
				.where("ExamParticipants.testId", "=", testId)
				.selectAll()
				.execute()
			).map(p => p.candidateId);
		}
		const test = parseResult(res, participants);
		return test;
	}
}