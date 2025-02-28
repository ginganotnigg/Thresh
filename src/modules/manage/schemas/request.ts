import { IsArray, IsEnum, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from "class-validator";
import { TestDifficulty } from "../../../common/domain/enum";
import { Transform, Type } from "class-transformer";
import Question from "../../../models/question";

export class TestFilterQuery {
	@IsString()
	@IsOptional()
	searchTitle?: string;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	minMinutesToAnswer?: number;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	maxMinutesToAnswer?: number;

	@Transform(({ value }) => (Array.isArray(value) ? value : [value]))
	@IsArray()
	@IsOptional()
	@IsEnum(TestDifficulty, { each: true })
	difficulty?: TestDifficulty[];

	@IsNumber({}, { each: true })
	@Type(() => Number)
	@IsOptional()
	tags?: number[];

	@IsNumber()
	@Type(() => Number)
	@Min(1)
	page: number;

	@IsNumber()
	@Type(() => Number)
	@IsOptional()
	perPage: number = 5;
}

export class QuestionCreateBody {
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

export class TestCreateBody {
	@IsArray()
	@IsNumber({}, { each: true })
	tagIds: number[];

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
	@Type(() => QuestionCreateBody)
	questions: QuestionCreateBody[];
}

export class TestUpdateBody {
	@IsArray()
	@IsNumber({}, { each: true })
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