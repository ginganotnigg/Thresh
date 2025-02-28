import { IsNumber } from "class-validator";

export class TestIdParams {
	@IsNumber()
	testId: number;
}

export class AttemptIdParams {
	@IsNumber()
	attemptId: number;
}

export class TagIdParams {
	@IsNumber()
	tagId: number;
}