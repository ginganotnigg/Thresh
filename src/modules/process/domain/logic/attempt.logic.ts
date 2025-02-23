import Attempt from "../../../../models/attempt";
import AttemptsAnswerQuestions from "../../../../models/attempts_answer_questions";

export class AttemptLogic {
	static getEndDate(attempt: Attempt): Date {
		return new Date(attempt.getDataValue("createdAt").getTime() + attempt.test!.getDataValue("minutesToAnswer")! * 60 * 1000);
	}

	static getCalculatedTotalScore(answers: AttemptsAnswerQuestions[]): number {
		const totalScore = answers.reduce<number>((acc, answer) => {
			const correctOption = answer.question!.getDataValue('correctOption');
			const chosenOption = answer.getDataValue('chosenOption');
			if (correctOption === chosenOption) {
				const points = answer.question!.getDataValue('points');
				return acc + points;
			}
			return acc;
		}, 0);
		return totalScore;
	}
}