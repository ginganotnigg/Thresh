import { z } from "zod";
import PracticeTest from "../../../domain/models/practice_test";
import sequelize from "../../../configs/orm/sequelize/sequelize";
import Test from "../../../domain/models/test";
import User from "../../../domain/models/user";
import Question from "../../../domain/models/question";
import { PracticeTestCoreSchema, QuestionCoreSchema, TestCoreSchema, UserCoreSchema } from "../../../domain/schema/core.schema";

export const CreatePraticeSchema = TestCoreSchema.omit({
	id: true,
	authorId: true,
}).extend({
	author: UserCoreSchema,
	questions: z.array(QuestionCoreSchema.omit({
		id: true,
		testId: true,
	})),
}).merge(PracticeTestCoreSchema.omit({
	id: true,
	testId: true,
}));

export type CreatePractice = z.infer<typeof CreatePraticeSchema>;

export async function commandCreatePratice(params: CreatePractice): Promise<{ id: string }> {
	const {
		author,
		title,
		description,
		minutesToAnswer,
		language,
		mode,
		questions,
		difficulty,
		tags,
		numberOfQuestions,
		numberOfOptions,
		outlines,
	} = params;
	const transaction = await sequelize.transaction();
	try {
		await User.upsert({
			id: author.id,
			name: author.name,
			avatar: author.avatar,
		}, { transaction });
		const test = await Test.create({
			authorId: author.id,
			title,
			description,
			minutesToAnswer,
			language,
			mode,
		}, { transaction });
		await PracticeTest.create({
			testId: test.get("id"),
			difficulty,
			tags,
			numberOfOptions,
			numberOfQuestions,
			outlines,
		}, { transaction });
		await Question.bulkCreate(questions.map((question) => ({
			testId: test.get("id"),
			...question,
		})), { transaction });
		await transaction.commit();
		return { id: test.get("id") as string };
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}