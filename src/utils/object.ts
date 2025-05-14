function removeNullFields<T extends object>(obj: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(obj).filter(([_, value]) => value != null)
	) as Partial<T>;
}

type MakeRequired<T, K extends keyof T> = T & {
	[P in K]-?: T[P];
};

export {
	removeNullFields,
	MakeRequired,
};