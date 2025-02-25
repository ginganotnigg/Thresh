import { IsNumber, IsOptional } from "class-validator";

export class AnswerAttemptParam {
	@IsNumber()
	testId: number;

	@IsNumber()
	questionId: number;

	@IsNumber()
	@IsOptional()
	optionId?: number;
}