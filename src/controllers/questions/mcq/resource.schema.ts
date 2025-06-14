import { z } from "zod";
import { QuestionTypeType } from "../../../domain/enum";

export const MCQResourceSchema = z.object({
	type: z.literal<QuestionTypeType>("MCQ"),

	options: z.string().array().min(2, { message: "At least two options are required" }).max(10, { message: "A maximum of 10 options is allowed" }).refine((options) => {
		return options.every(option => typeof option === 'string' && option.trim() !== '');
	}, {
		message: "All options must be non-empty strings",
	}),
	correctOption: z.number().int().nonnegative().nullable(),
});
