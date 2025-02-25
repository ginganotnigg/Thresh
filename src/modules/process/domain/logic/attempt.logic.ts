import Attempt from "../../../../models/attempt";
import AttemptsAnswerQuestions from "../../../../models/attempts_answer_questions";

export class AttemptLogic {
	static getEndDate(attempt: Attempt): Date {
		return new Date(attempt.getDataValue("createdAt").getTime() + attempt.Test!.getDataValue("minutesToAnswer")! * 60 * 1000);
	}

	static getCalculatedTotalScore(answers: AttemptsAnswerQuestions[]): number {
		const totalScore = answers.reduce<number>((acc, answer) => {
			const correctOption = answer.Question!.getDataValue('correctOption');
			const chosenOption = answer.getDataValue('chosenOption');
			if (correctOption === chosenOption) {
				const points = answer.Question!.getDataValue('points');
				return acc + points;
			}
			return acc;
		}, 0);
		return totalScore;
	}
}