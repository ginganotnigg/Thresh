import Attempt from '../../../models/attempt';
import AttemptsAnswerQuestions from '../../../models/attempts_answer_questions';
import Question from '../../../models/question';
import Test from '../../../models/test';
import { AttemptStatus } from '../../../common/domain/enum';
import { AttemptLogic } from '../domain/logic/attempt.logic';
import { CurrentAttemptDetailResult, CurrentAttemptSmallResult } from './schemas/result';

export default class QueryUsecase {
	async getInProgressAttemptId(testId: string, candidateId: string): Promise<number | null> {
		const attempt = await Attempt.findOne({
			where: {
				testId: testId,
				candidateId: candidateId,
				status: AttemptStatus.IN_PROGRESS,
			},
			attributes: ['ID'],
		});
		if (attempt == null) {
			return null;
		}
		return attempt.id;
	}

	/**
	 * Return the currently In Progress attempt of a candidate in small detail for showing in the list
	 */
	async getInProgressAttemptSmall(testId: number, candidateId: string): Promise<CurrentAttemptSmallResult | null> {
		const attempt = await Attempt.findOne({
			where: {
				testId: testId,
				candidateId: candidateId,
				status: AttemptStatus.IN_PROGRESS,
			},
			attributes: ['ID', 'status', 'createdAt'],
			include: [{
				model: Test,
				attributes: ['minutesToAnswer'],
			}]
		});
		if (attempt == null) {
			return null;
		}
		const endDate = AttemptLogic.getEndDate(attempt);
		return {
			id: attempt.id,
			startedAt: attempt.createdAt,
			endedAt: endDate,
		};
	}

	/**
	 * Return the currently In Progress attempt of a candidate in detail for doing the test
	 */
	async getInProgressAttemptToDo(testId: number, candidateId: string): Promise<CurrentAttemptDetailResult> {
		const attempt = await Attempt.findOne({
			where: {
				testId: testId,
				candidateId: candidateId,
				status: AttemptStatus.IN_PROGRESS,
			},
			attributes: { exclude: ["score"] },
			include: [
				{
					model: Test,
					attributes: { exclude: ['answerCount'] },
				},
				{
					model: AttemptsAnswerQuestions,
					attributes: ['chosenOption'],
					include: [{
						model: Question,
						attributes: { exclude: ['correctOption'] },
					}]
				}
			]
		});
		if (attempt == null) {
			throw new Error('Attempt not found');
		}
		return {
			id: attempt.id,
			test: {
				id: attempt.Test!.id,
				managerId: attempt.Test!.managerId,
				title: attempt.Test!.title,
				description: attempt.Test!.description,
				minutesToAnswer: attempt.Test!.minutesToAnswer,
				difficulty: attempt.Test!.difficulty,
				createdAt: attempt.Test!.createdAt,
				updatedAt: attempt.Test!.updatedAt,
			},
			questions: attempt.Attempts_answer_Questions!.map(answer => ({
				id: answer.Question!.id,
				text: answer.Question!.text,
				options: answer.Question!.options!.map((option, index) => ({ id: index, text: option })),
				points: answer.Question!.points,
				chosenOption: answer.chosenOption,
			})),
			startedAt: attempt.createdAt,
			endedAt: AttemptLogic.getEndDate(attempt),
		};
	}
}
