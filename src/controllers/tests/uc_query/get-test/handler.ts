import { db } from "../../../../configs/orm/kysely/db";
import { buildTestQuery, parseResult } from "../../../../schemas/build/build-test-query";
import { DomainError } from "../../../../shared/errors/domain.error";
import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { GetTestQueryParam } from "./param";
import { GetTestResponse } from "./response";

export class GetTestQueryHandler extends QueryHandlerBase<GetTestQueryParam, GetTestResponse> {
	async handle(param: GetTestQueryParam): Promise<GetTestResponse> {
		const { viewPassword } = param;
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
		if (viewPassword === "0" && res.password && test._detail.mode === "EXAM") {
			test._detail.password = "********"; // Hide password if viewPassword is not allowed
		}
		return test;
	}
}