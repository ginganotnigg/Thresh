import { IsNumber, IsOptional } from "class-validator";

export class AnswerAttemptBody {
	@IsNumber()
	questionId: number;

	@IsNumber()
	@IsOptional()
	optionId?: number;
}