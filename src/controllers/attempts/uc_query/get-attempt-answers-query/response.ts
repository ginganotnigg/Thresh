import { z } from "zod";
import { AnswerCoreSchema } from "../../schemas/answer-resource.schema";
import { ChuoiDocument } from "../../../../library/caychuoijs/documentation/open-api";

export const GetAttemptAnswersResponseSchema = ChuoiDocument.registerSchema(AnswerCoreSchema
	.extend({})
	.array()
	, "GetAttemptAnswersResponseSchema");
export type GetAttemptAnswersResponse = z.infer<typeof GetAttemptAnswersResponseSchema>;
