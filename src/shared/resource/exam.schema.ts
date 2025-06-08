import { z } from "zod";
import { TestInfoSchema } from "./test.schema";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

export const ExamTestCoreSchema = ChuoiDocument.registerSchema(
	z.object({
		testId: z.string(),
		hasPassword: z.boolean(),
		roomId: z.string(),
		numberOfAttemptsAllowed: z.number().int().positive(),
		isAnswerVisible: z.boolean(),
		isAllowedToSeeOtherResults: z.boolean(),
		openDate: z.coerce.date(),
		closeDate: z.coerce.date(),
	}),
	"ExamTestCoreSchema"
);
export type ExamTestCore = z.infer<typeof ExamTestCoreSchema>;

export const ExamTestInfoSchema = ChuoiDocument.registerSchema(
	TestInfoSchema
		.merge(ExamTestCoreSchema.omit({ testId: true }))
	, "ExamTestInfoSchema"
);
export type ExamTestInfo = z.infer<typeof ExamTestInfoSchema>;
