import * as fs from 'fs';
import csvParser from 'csv-parser';

/**
 * Reads and parses a CSV file
 * @param filePath Path to the CSV file
 * @returns Promise resolving to an array of parsed CSV rows
 */
export function readCsv<T = any>(filePath: string): Promise<T[]> {
	const results: T[] = [];

	return new Promise((resolve, reject) => {
		fs.createReadStream(filePath)
			.on('error', (error) => reject(error))
			.pipe(csvParser())
			.on('data', (data: T) => results.push(data))
			.on('end', () => {
				resolve(results);
			})
			.on('error', (error) => reject(error));
	});
}

/**
 * Example usage:
 * 
 * interface UserData {
 *   name: string;
 *   age: string;
 *   email: string;
 * }
 * 
 * async function loadUsers() {
 *   try {
 *     const users = await readCsv<UserData>('./data/users.csv');
 *     console.log(users);
 *   } catch (error) {
 *     console.error('Error loading CSV:', error);
 *   }
 * }
 */