import { z } from "zod";
import sequelize from "../../../../configs/orm/sequelize/sequelize";
import Feedback from "../../../../domain/models/feedback";
import { FeedbackProblemsEnum } from "../../../../domain/models/feedback";

export const CreateFeedbackSchema = z.object({
	rating: z.number().min(1).max(10),
	problems: z.array(z.nativeEnum(FeedbackProblemsEnum)).optional().default([]),
	comment: z.string().optional().default(""),
});

export type CreateFeedback = z.infer<typeof CreateFeedbackSchema>;

export async function commandCreateFeedback(params: CreateFeedback & { practiceTestId: string }): Promise<void> {
	const {
		practiceTestId,
		rating,
		problems,
		comment,
	} = params;

	const transaction = await sequelize.transaction();
	try {
		await Feedback.create({
			practiceTestId,
			rating,
			problems,
			comment,
		}, { transaction });

		await transaction.commit();
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}