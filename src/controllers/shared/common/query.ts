import { SelectQueryBuilder } from "kysely";

interface PageResult<TOut> {
	data: TOut[]
	total: number;
	page: number;
	perPage: number;
	totalPages: number;
}

export async function paginate<TOut>(qb: SelectQueryBuilder<any, any, TOut>, page: number, perPage: number): Promise<PageResult<TOut>> {
	const limit = perPage;
	const offset = (page - 1) * limit;
	const [res, total] = await Promise.all([
		qb.offset(offset).limit(limit).execute(),
		qb.clearSelect().select(eb => [eb.fn.countAll<number>().as('count')]).executeTakeFirstOrThrow(),
	])
	return {
		data: res,
		total: total.count,
		page,
		perPage,
		totalPages: Math.ceil(total.count / limit),
	}
}
