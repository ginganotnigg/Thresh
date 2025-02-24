import { IsEnum, IsNumber, IsObject, IsOptional, IsString, Min } from "class-validator";
import { TestDifficulty } from "../../../common/domain/enum";

export class TestFilterParam {
	@IsString()
	@IsOptional()
	searchTitle?: string;

	@IsNumber()
	@IsOptional()
	minMinutesToAnswer?: number;

	@IsNumber()
	@IsOptional()
	maxMinutesToAnswer?: number;

	@IsEnum({}, { each: true })
	@IsOptional()
	difficulty?: TestDifficulty[];

	@IsNumber({}, { each: true })
	@IsOptional()
	tags?: number[];

	@IsNumber()
	@Min(1)
	page: number;

	@IsNumber()
	@IsOptional()
	perPage: number = 5;
}

export type TestCreateParam = {
	tags: number[];
	managerId: string;
	title: string;
	description: string;
	difficulty: TestDifficulty;
	minutesToAnswer: number;
	questions: {
		text: string;
		options: string[];
		points: number;
		correctOption: number;
	}[];
}

export type TestUpdateParam = TestCreateParam & {
	id: number;
}