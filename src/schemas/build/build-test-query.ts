import { db } from "../../configs/orm/kysely/db";
import { DomainError } from "../../shared/errors/domain.error";
import { TestDetailCommon } from "../common/test-detail";
import { TestFull } from "../core/test";

export function buildTestQuery() {
	const attemptScores = db
		.selectFrom("AttemptsAnswerQuestions as aaq")
		.select([
			"aaq.attemptId",
			eb => eb.fn.sum<number>("aaq.pointsReceived").as("totalPoints"),
		])
		.groupBy("aaq.attemptId")
		.as("attempt_scores");

	const attemptStats = db
		.selectFrom(["Attempts as a", attemptScores])
		.select([
			"a.testId",
			eb => eb.fn.count<number>("a.id").as("totalAttempts"),
			eb => eb.fn.count<number>("a.candidateId").distinct().as("totalCandidates"),
			eb => eb.fn.max<number>("attempt_scores.totalPoints").as("highestScore"),
			eb => eb.fn.min<number>("attempt_scores.totalPoints").as("lowestScore"),
			eb => eb.fn.avg<number>("attempt_scores.totalPoints").as("averageScore"),
			eb => eb.fn.avg<number>("a.secondsSpent").as("averageTime"),
		])
		.whereRef("attempt_scores.attemptId", "=", "a.id")
		.groupBy("a.testId")
		.as("astats");

	const query = db
		.selectFrom("Tests as t")
		.leftJoin("PracticeTests as pt", "pt.testId", "t.id")
		.leftJoin("ExamTests as et", "et.testId", "t.id")
		.leftJoin(
			db
				.selectFrom("Questions as q")
				.select([
					"q.testId",
					eb => eb.fn.count<number>("q.id").as("agg_numberOfQuestions"),
					eb => eb.fn.sum<number>("q.points").as("agg_totalPoints"),
				])
				.groupBy("q.testId")
				.as("qstats"),
			"qstats.testId",
			"t.id"
		)
		.leftJoin(attemptStats, "astats.testId", "t.id")
		.selectAll()
		.select([
			"t.id as id",
			"t.createdAt as createdAt",
			"t.updatedAt as updatedAt",
		])
		;
	return query;
}

type ExecuteQuery = ReturnType<typeof buildTestQuery>["executeTakeFirst"];
type ResultType = Awaited<ReturnType<ExecuteQuery>>;

export function parseResult(res: ResultType, participants: string[], hidePassword: boolean = true): TestFull {
	if (!res) {
		throw new DomainError("Test not found");
	}
	const testDetail: TestDetailCommon = res.mode === "EXAM" ?
		{
			mode: "EXAM",
			roomId: res.roomId!,
			hasPassword: res.password !== null,
			password: hidePassword ? null : res.password,
			numberOfAttemptsAllowed: Number(res.numberOfAttemptsAllowed!),
			numberOfParticipants: Number(res.numberOfParticipants!),
			isPublic: res.isPublic! === 1,
			isAnswerVisible: res.isAnswerVisible! === 1,
			isAllowedToSeeOtherResults: res.isAllowedToSeeOtherResults! === 1,
			openDate: res.openDate!,
			closeDate: res.closeDate!,
			participants: participants,
		} : {
			mode: "PRACTICE",
			difficulty: res.difficulty!,
			tags: res.tags as string[] ?? [],
			numberOfQuestions: Number(res.numberOfQuestions!),
			numberOfOptions: Number(res.numberOfOptions!),
			outlines: res.outlines as string[] ?? [],
		}

	const test: TestFull = {
		id: res.id!,
		authorId: res.authorId!,
		title: res.title!,
		description: res.description!,
		minutesToAnswer: res.minutesToAnswer!,
		language: res.language!,
		mode: res.mode!,
		createdAt: res.createdAt!,
		updatedAt: res.updatedAt!,
		_aggregate: {
			numberOfQuestions: Number(res.agg_numberOfQuestions) ?? 0,
			totalPoints: Number(res.agg_totalPoints) ?? 0,
			totalCandidates: Number(res.totalCandidates) ?? 0,
			totalAttempts: Number(res.totalAttempts) ?? 0,
			averageScore: Number(res.averageScore) ?? 0,
			highestScore: Number(res.highestScore) ?? 0,
			lowestScore: Number(res.lowestScore) ?? 0,
			averageTime: Number(res.averageTime) ?? 0,
		},
		_detail: testDetail,
	}
	return test;
}