import { db } from "../../configs/orm/kysely/db";
import { TestBaseSchemaType } from "./base.schema";
import { ExamResourceSchemaType } from "./exam/resource.schema";
import { PracticeResourceSchemaType } from "./practice/resource.schema";

export async function getTestQuery(testId: string): Promise<TestBaseSchemaType | undefined> {
	const testQuery = db
		.selectFrom("Tests")
		.leftJoin("ExamTests as et", "et.testId", "Tests.id")
		.leftJoin("PracticeTests as pt", "pt.testId", "Tests.id")
		.selectAll()
		.where("id", "=", testId)
		.limit(1);

	const test = await testQuery.executeTakeFirst();
	if (!test) return undefined;

	const pratice: PracticeResourceSchemaType = {
		...test,
		difficulty: test.difficulty ? test.difficulty.toString() : "EASY",
		tags: test.tags ? JSON.parse(test.tags.toString()) : [],
		numberOfOptions: test.numberOfOptions!,
		numberOfQuestions: test.numberOfQuestions!,
		outlines: test.outlines ? JSON.parse(test.outlines.toString()) : [],
		mode: "PRACTICE",
	};
	const exam: ExamResourceSchemaType = {
		...test,
		hasPassword: test.password !== null,
		closeDate: test.closeDate!.toISOString(),
		openDate: test.openDate!.toISOString(),
		numberOfAttemptsAllowed: test.numberOfAttemptsAllowed!,
		isAnswerVisible: test.isAnswerVisible === 1,
		isAllowedToSeeOtherResults: test.isAllowedToSeeOtherResults === 1,
		roomId: test.roomId!,
		mode: "EXAM",
	}
	const child:
		ExamResourceSchemaType |
		PracticeResourceSchemaType
		= test.mode === "EXAM" ? exam : pratice;

	return {
		id: test.id,
		authorId: test.authorId,
		title: test.title,
		description: test.description,
		minutesToAnswer: test.minutesToAnswer,
		language: test.language,
		createdAt: test.createdAt!,
		updatedAt: test.updatedAt!,
		child: child,
	};
}
