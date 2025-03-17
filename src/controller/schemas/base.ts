import { z } from 'zod';

export type Paged<T> = {
	page: number;
	perPage: number;
	total: number;
	totalPages: number;
	data: T[];
};

export const PagedSchema = <T>(dataSchema: z.ZodType<T>) => z.object({
	page: z.number(),
	perPage: z.number(),
	total: z.number(),
	totalPages: z.number(),
	data: z.array(dataSchema),
});