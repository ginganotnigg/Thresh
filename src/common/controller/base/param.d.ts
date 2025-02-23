export type Paged<T> = {
	page: number;
	perPage: number;
	total: number;
	totalPages: number;
	data: T[];
}

export type RangeFilter<T> = {
	from: T;
	to: T;
}

export type SortFilter<TModel> = {
	field: keyof TModel;
	order: "asc" | "desc";
}

export type OptionsFilter<TModel> = {
	field: keyof TModel;
	options: TModel[keyof TModel][];
}