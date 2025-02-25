import { IsEnum, IsOptional, IsString, Min } from "class-validator";

export class AttemptFilterParam {
	@IsEnum(["asc", "desc"])
	@IsOptional()
	sortByStartDate?: "asc" | "desc";

	@IsEnum(["asc", "desc"])
	@IsOptional()
	sortByScore?: "asc" | "desc";

	@IsString()
	@Min(1)
	page: number;

	@IsString()
	@IsOptional()
	perPage: number = 5;
}

export class AttemptAnswerFilterParam {
	@IsString()
	@Min(1)
	page: number;

	@IsString()
	@IsOptional()
	perPage: number = 10;
}