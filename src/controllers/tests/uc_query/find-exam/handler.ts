import { db } from "../../../../configs/orm/kysely/db";
import { buildTestQuery, parseResult } from "../../../../schemas/build/build-test-query";
import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { FindExamParam } from "./param";
import { FindExamResponse } from "./response";

export class FindExamQueryHandler extends QueryHandlerBase<FindExamParam, FindExamResponse> {
	async handle(param: FindExamParam): Promise<FindExamResponse> {
		const { userId } = this.getCredentials();
		const { roomId } = param;
		let query = buildTestQuery();
		query = query
			.where("t.mode", "=", "EXAM")
			.where("et.roomId", "=", roomId)
			.where("et.openDate", "<=", new Date())
			.where("et.closeDate", ">=", new Date())
			.where(eb => eb(
				"et.numberOfParticipants",
				"<",
				eb
					.selectFrom("ExamParticipants as ep")
					.whereRef("ep.testId", "=", "et.testId")
					.select(eb2 => eb2.fn.count<number>("ep.candidateId").distinct().as("participantCount")
					))
			)
			.selectAll();
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