import { z } from "zod";
import { FeedbackProblemsAsConst } from "../../domain/enum";
import { PagedSchema } from "../../shared/controller/schemas/base";
import { ChuoiDocument } from "../../library/caychuoijs/documentation/open-api";

const FeedbackCoreSchema = z.object({
	id: z.string(),
	testId: z.string(),
	rating: z.number().min(1).max(10),
	problems: z.array(z.enum(FeedbackProblemsAsConst)).optional().default([]),
	comment: z.string().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const FeedbackResourceSchema = ChuoiDocument.registerSchema(FeedbackCoreSchema, "FeedbackResourceSchema");
export const FeedbacksResourceSchema = ChuoiDocument.registerSchema(PagedSchema(FeedbackCoreSchema), "FeedbacksResourceSchema");
