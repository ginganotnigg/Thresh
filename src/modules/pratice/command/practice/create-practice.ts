import { z } from "zod";
import PracticeTest from "../../../../domain/models/practice_test";
import sequelize from "../../../../configs/orm/sequelize/sequelize";
import { PracticeTestCoreSchema } from "../../../../domain/schema/core.schema";
import { CreateTestSchema } from "../../../../domain/schema/create.schema";
import { TestRepo } from "../../../../domain/core/repo/test.repo";

export const CreatePracticeSchema = CreateTestSchema.extend({
	practice: PracticeTestCoreSchema.omit({
		testId: true,
	}),
});

export type CreatePractice = z.infer<typeof CreatePracticeSchema>;

export async function commandCreatePractice(authorId: string, params: CreatePractice): Promise<{ testId: string }> {
	const transaction = await sequelize.transaction();
	try {
		const { testId } = await TestRepo.createTest({
			test: {
				...params.test,
				authorId,
				mode: "practice",
			},
			questions: params.questions,
		}, transaction);
		await PracticeTest.create({
			testId,
			...params.practice,
		}, { transaction });
		await transaction.commit();
		return { testId };
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}