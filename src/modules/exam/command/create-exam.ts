import sequelize from "../../../configs/orm/sequelize/sequelize";
import ExamTest from "../../../domain/models/exam_test";
import { DomainError } from "../../../controller/errors/domain.error";
import { TestRepo } from "../../../domain/core/repo/test.repo";
import { CreateTestSchema } from "../../../domain/schema/create.schema";
import { ExamTestCoreSchema } from "../../../domain/schema/core.schema";
import { z } from "zod";

const CreateExamSchema = CreateTestSchema.extend({
	exam: ExamTestCoreSchema.omit({
		testId: true,
	}),
});

export type CreateExamType = z.infer<typeof CreateExamSchema>;

export default async function commandCreateExam(param: CreateExamType): Promise<{ testId: string }> {
	const transaction = await sequelize.transaction();
	try {
		const duplicateTest = await ExamTest.findOne({
			where: {
				roomId: param.exam.roomId,
			},
		});
		if (duplicateTest) {
			throw new DomainError("Room ID already exists");
		}
		const { testId } = await TestRepo.createTest({
			test: param.test,
			questions: param.questions,
		})

		await ExamTest.create({
			...param.exam,
			testId: testId,
		}, { transaction });

		await transaction.commit();
		return { testId: testId };
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}