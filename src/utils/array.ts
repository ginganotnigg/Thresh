function isSorted<T extends object>(array: T[], field: keyof T, isDesc = true): boolean {
	for (let i = 1; i < array.length; i++) {
		if (array[i - 1] == null || array[i] == null) {
			throw new Error("Items is null");
		}
		if (array[i][field] == null || array[i - 1][field] == null) {
			throw new Error("Field is null");
		}
		if (isDesc == false && array[i][field] < array[i - 1][field]) {
			return false;
		}
		if (isDesc == true && array[i][field] > array[i - 1][field]) {
			return false;
		}
	}
	return true;
};

export { isSorted };