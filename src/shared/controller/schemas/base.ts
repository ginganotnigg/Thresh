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

export const PagingSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	perPage: z.coerce.number().optional().default(5),
});

export type Paging = z.infer<typeof PagingSchema>;

export const SortParamSchema = (sortFields: string[]) => z
	.string()
	.transform((val) => val.split(','))
	.refine(
		(fields) =>
			fields.every((field) => {
				const fieldName = field.startsWith('-') ? field.slice(1) : field;
				return sortFields.includes(fieldName);
			}),
		{
			message: `Invalid sort fields. Allowed fields: ${sortFields.join(', ')}`,
		}
	);


export const sortBy = (sortField: string) => {
	const field = sortField.startsWith('-') ? sortField.slice(1) : sortField;
	const order = sortField.startsWith('-') ? 'desc' : 'asc';
	return { field, order: order as 'asc' | 'desc' };
}