import { db } from "../../../../configs/orm/kysely/db";
import { buildTestQuery, parseResult } from "../../../../schemas/build/build-test-query";
import { paginate } from "../../../../shared/handler/query";
import { QueryHandlerBase } from "../../../../shared/handler/usecase.base";
import { GetTestsQuery } from "./param";
import { GetTestsResponse } from "./response";

export class GetTestsQueryHandler extends QueryHandlerBase<GetTestsQuery, GetTestsResponse> {
	async handle(param: GetTestsQuery): Promise<GetTestsResponse> {
		const {
			page,
			perPage,
			authorId,
			candidateId,
			mode,
			searchTitle,
			sortCreatedAt,
			sortTitle,
			actions,
			filterStatuses,
		} = param;

		let query = buildTestQuery();
		query.where("et.isPublic", "=", 1);

		if (authorId) {
			query = query.where("t.authorId", "=", authorId);
		}
		if (candidateId) {
			query = query
				.where((eb) => eb.exists(
					eb.selectFrom("Attempts")
						.select(eb.lit(1).as("exists"))
						.where("Attempts.testId", "=", eb.ref("t.id"))
						.where("Attempts.candidateId", "=", candidateId)
				));
		}
		if (mode) {
			query = query.where("t.mode", "=", mode);
		}
		if (searchTitle) {
			query = query.where("t.title", "like", `%${searchTitle}%`);
		}
		if (sortCreatedAt) {
			query = query.orderBy("t.createdAt", sortCreatedAt);
		}
		if (sortTitle) {
			query = query.orderBy("t.title", sortTitle);
		}
		if (actions === "view") {
			const userId = this.getCredentials().userId;
			const now = new Date();
			query = query
				.where((eb) => eb.or([
					eb("t.mode", "=", "PRACTICE")
						.and("t.authorId", "=", userId)
					,
					eb("t.mode", "=", "EXAM")
						.and("et.isPublic", "=", 1)
						.and("et.openDate", "<=", now)
						.and("et.closeDate", ">=", now)
					,
				]));
		}
		if (filterStatuses.length > 0) {
			const now = new Date();
			query = query.where((eb) => {
				const conditions = [];

				if (filterStatuses.includes("UPCOMING")) {
					conditions.push(eb("et.openDate", ">", now));
				}
				if (filterStatuses.includes("OPEN")) {
					conditions.push(
						eb("et.openDate", "<=", now)
							.and("et.closeDate", ">=", now)
					);
				}
				if (filterStatuses.includes("CLOSED")) {
					conditions.push(eb("et.closeDate", "<", now));
				}

				return eb.or(conditions);
			});
		}

		const res = await paginate(query, page, perPage);
		const examIds = res.data.map(raw => raw.mode === "EXAM" ? raw.id : null).filter(id => id !== null);

		let participantsQuery = db
			.selectFrom("ExamParticipants")
			.selectAll()
			;
		if (examIds.length > 0) {
			participantsQuery = participantsQuery.where("testId", "in", examIds);
		}
		const participants = await participantsQuery.execute();
		const participantMap = new Map<string, string[]>();
		for (const participant of participants) {
			if (!participantMap.has(participant.testId)) {
				participantMap.set(participant.testId, []);
			}
			participantMap.get(participant.testId)?.push(participant.candidateId);
		}
		return {
			...res,
			data: res.data.map(raw => parseResult(raw, participantMap.get(raw.id) || [])),
		}
	}
}