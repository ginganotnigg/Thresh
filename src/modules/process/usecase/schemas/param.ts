import { IsNumber, IsOptional } from "class-validator";

export class AnswerAttemptParam {
	@IsNumber()
	questionId: number;

	@IsNumber()
	@IsOptional()
	optionId?: number;
}