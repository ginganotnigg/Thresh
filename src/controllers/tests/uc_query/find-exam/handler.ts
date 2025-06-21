import { db } from "../../../../configs/orm/kysely/db";
import { buildTestQuery, parseResult } from "../../../../schemas/build/build-test-query";
import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { FindTestQuery } from "./param";
import { FindTestResponse } from "./response";

export class FindTestQueryHandler extends QueryHandlerBase<FindTestQuery, FindTestResponse> {
	async handle(param: FindTestQuery): Promise<FindTestResponse> {
		const { userId } = this.getCredentials();
		const { roomId } = param;
		const now = new Date();
		const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000); // Convert to UTC
		let query = buildTestQuery();
		query = query
			.where("t.mode", "=", "EXAM")
			.where("et.roomId", "=", roomId)
			.where("et.openDate", "<=", utcNow)
			.where("et.closeDate", ">=", utcNow)
			.where(eb => eb.or([
				eb(
					"et.numberOfParticipants",
					">",
					eb
						.selectFrom("ExamParticipants as ep")
						.whereRef("ep.testId", "=", "et.testId")
						.select(eb2 => eb2.fn.count<number>("ep.candidateId").distinct().as("participantCount")
						)
				),
				eb("et.numberOfParticipants", "=", 0),
			])
			)
			;
		const exam = await query.executeTakeFirst();
		if (!exam) {
			return {
				data: null,
				hasJoined: false,
			};
		}

		const participants = await db
			.selectFrom("ExamParticipants")
			.where("ExamParticipants.testId", "=", exam.id)
			.selectAll()
			.execute();
		const hasJoined = participants.some(p => p.candidateId === userId);
		const data = parseResult(exam, participants.map(p => p.candidateId));
		return {
			data,
			hasJoined,
		};
	}
}