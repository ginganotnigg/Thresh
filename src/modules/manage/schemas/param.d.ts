import { IsArray, IsEnum, IsNumber, IsObject, IsOptional, IsString, Max, Min } from "class-validator";
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

export class QuestionCreateParam {
	@IsString()
	text: string;

	@IsArray()
	@IsString({ each: true })
	options: string[];

	@IsNumber()
	points: number;

	@IsNumber()
	correctOption: number;
}

export class TestCreateParam {
	@IsArray()
	@IsNumber({ each: true })
	tagIds: number[];

	@IsString()
	managerId: string;

	@IsString()
	title: string;

	@IsString()
	description: string;

	@IsEnum(TestDifficulty)
	difficulty: TestDifficulty;

	@IsNumber()
	@Min(1)
	@Max(10000)
	minutesToAnswer: number;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => Question)
	questions: QuestionCreateParam[];
}

export class TestUpdateParam {
	@IsNumber()
	id: number;

	@IsArray()
	@IsNumber({ each: true })
	@IsOptional()
	tagIds?: number[];

	@IsString()
	title?: string;

	@IsString()
	description?: string;

	@IsEnum(TestDifficulty)
	difficulty?: TestDifficulty;

	@IsNumber()
	@Min(1)
	@Max(10000)
	minutesToAnswer?: number;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => Question)
	@IsOptional()
	questions?: Question[];
}