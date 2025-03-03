import { readCsv } from "../common/utils/file";

/**
 * Converts a pipe-separated string to an array of strings
 * @param pipeString The pipe-separated string to convert
 * @returns Array of strings split at each pipe character
 */
export function pipeStringToArray(pipeString: string): string[] {
	if (!pipeString || typeof pipeString !== 'string') {
		return [];
	}
	return pipeString.split('|').map(item => item.trim());
}

const dateList = [
	new Date('2022-01-15'),
	new Date('2022-03-22'),
	new Date('2023-05-10'),
	new Date('2023-07-19'),
	new Date('2024-02-28'),
	new Date('2024-11-05'),
	new Date('2022-09-13'),
	new Date('2023-12-25'),
	new Date('2024-04-17'),
	new Date('2022-06-30')
];

const dateObjects = dateList.map((date, index) => {
	const createdAt = date;
	const updatedAt = new Date(date);
	updatedAt.setDate(updatedAt.getDate() + Math.floor(Math.random() * 11));
	return { createdAt, updatedAt };
});

export async function load() {
	const tags = (await readCsv(`${__dirname}/data/tags.csv`));
	const tests = await readCsv(`${__dirname}/data/tests.csv`);
	const testsHasTags = await readCsv(`${__dirname}/data/tests_has_tags.csv`);
	const questions = (await readCsv(`${__dirname}/data/questions.csv`)).map(q => ({ ...q, options: JSON.stringify(pipeStringToArray(q.options)) }));
	const attempts = await readCsv(`${__dirname}/data/attempts.csv`);
	const attemptsAnswerQuestions = [];
	for (let i = 0; i < attempts.length; i++) {
		const a = attempts[i];
		for (let j = 0; j < questions.length; j++) {
			const q = questions[j];
			if (a.testId == q.testId) {
				const randomOption = Math.floor(Math.random() * 5);
				if (randomOption <= 3) {
					attemptsAnswerQuestions.push({
						attemptId: i + 1,
						questionId: j + 1,
						chosenOption: randomOption,
					});
				}
			}
		}
	}
	const dateTags = tags.map((tag, index) => ({ ...tag, ...(dateObjects[index % dateObjects.length]) }));
	const dateTests = tests.map((test, index) => ({ ...test, ...(dateObjects[index % dateObjects.length]) }));
	const dateAttempts = attempts.map((attempt, index) => ({ ...attempt, ...(dateObjects[index % dateObjects.length]) }));
	const dateAttemptsAnswerQuestions = attemptsAnswerQuestions.map((attemptAnswerQuestion, index) => ({ ...attemptAnswerQuestion, ...(dateObjects[index % dateObjects.length]) }));
	return {
		tags: dateTags,
		tests: dateTests,
		testsHasTags,
		questions,
		attempts: dateAttempts,
		attemptsAnswerQuestions: dateAttemptsAnswerQuestions
	};
}