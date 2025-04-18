import { z } from "zod";
import { TestDifficulty } from "../../../domain/enum";

const TestFilterQuerySchema = z.object({
	searchTitle: z.string().optional(),
	minMinutesToAnswer: z.coerce.number().optional(),
	maxMinutesToAnswer: z.coerce.number().optional(),
	difficulty: z.union([
		z.array(z.nativeEnum(TestDifficulty)),
		z.string().transform((str) => {
			if (!str) return [];
			return str.split(',').map(s => s.trim())
				.filter(s => Object.values(TestDifficulty).includes(s as TestDifficulty))
				.map(s => s as TestDifficulty);
		})
	]).optional(),
	tags: z.union([
		z.array(z.string()),
		z.string().transform((str) => {
			if (!str) return [];
			return str.split(',').map(Number).filter(n => !isNaN(n));
		})
	]).optional(),
	managerIds: z.union([
		z.array(z.string()),
		z.string().transform((str) => {
			if (!str) return [];
			return str.split(',').map(Number).filter(n => !isNaN(n));
		})
	]).optional(),
	sortBy: z.union([
		z.array(z.object({
			field: z.enum(['createdAt', 'updatedAt', 'title']),
			order: z.enum(['asc', 'desc'])
		})).optional().transform((sortBy) => {
			if (!sortBy || sortBy.length === 0) return [{ field: 'createdAt', order: 'desc' }];
			return sortBy.map(({ field, order }) => ({ field, order }));
		}),
		z.string().transform((str, ctx) => {
			if (!str) return [{ field: 'createdAt', order: 'desc' }];
			const obj = JSON.parse(str);
			if (Array.isArray(obj)) {
				if (z.array(z.object({
					field: z.string(),
					order: z.string()
				})).safeParse(obj).success) {
					return obj;
				}
			}
			if (typeof obj === 'object') {
				if (z.object({ field: z.string(), order: z.string() }).safeParse(obj).success) {
					return [{ field: obj.field, order: obj.order }];
				}
			}
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Invalid sortBy format',
			});
			return z.NEVER;
		}),
		z.array(z.string()).transform((str, ctx) => {
			if (!str || str.length === 0) return [{ field: 'createdAt', order: 'desc' }];
			const objs = str.map((s) => {
				const obj = JSON.parse(s);
				if (z.object({ field: z.string(), order: z.string() }).safeParse(obj).success) {
					return obj;
				}
				return z.NEVER;
			});
			if (objs.some((obj) => obj === z.NEVER)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Invalid sortBy format',
				});
				return z.NEVER;
			}
			return objs;
		}),
	]).default([{ field: 'createdAt', order: 'desc' }]).optional(),
	page: z.coerce.number().min(1).default(1),
	perPage: z.coerce.number().optional().default(5),
});

const QuestionCreateBodySchema = z.object({
	text: z.string(),
	options: z.array(z.string()),
	points: z.number(),
	correctOption: z.number(),
});

const TestCreateBodySchema = z.object({
	tagIds: z.array(z.number()),
	title: z.string(),
	description: z.string(),
	difficulty: z.nativeEnum(TestDifficulty),
	minutesToAnswer: z.number().min(1).max(10000),
	questions: z.array(QuestionCreateBodySchema),
});

const TestUpdateBodySchema = z.object({
	tagIds: z.array(z.number()).optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	difficulty: z.nativeEnum(TestDifficulty).optional(),
	minutesToAnswer: z.number().min(1).max(10000).optional(),
	questions: z.array(QuestionCreateBodySchema).optional(), // No id field, recreate all questions
});

export {
	TestFilterQuerySchema,
	QuestionCreateBodySchema,
	TestCreateBodySchema,
	TestUpdateBodySchema,
};

export type TestFilterQuery = z.infer<typeof TestFilterQuerySchema>;
export type QuestionCreateBody = z.infer<typeof QuestionCreateBodySchema>;
export type TestCreateBody = z.infer<typeof TestCreateBodySchema>;
export type TestUpdateBody = z.infer<typeof TestUpdateBodySchema>;