function removeNullFields<T extends object>(obj: T): Partial<T> {
	return Object.fromEntries(
		Object.entries(obj).filter(([_, value]) => value != null)
	) as Partial<T>;
}

export { removeNullFields };