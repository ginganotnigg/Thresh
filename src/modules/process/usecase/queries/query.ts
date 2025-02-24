import Attempt from '../../../../models/attempt';
import AttemptsAnswerQuestions from '../../../../models/attempts_answer_questions';
import Question from '../../../../models/question';
import Test from '../../../../models/test';
import { AttemptStatus } from '../../../../common/domain/enum';
import { AttemptLogic } from '../../domain/logic/attempt.logic';
import { CurrentAttemptDetailResult, CurrentAttemptSmallResult } from './result';

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
	async getInProgressAttemptSmall(testId: string, candidateId: string): Promise<CurrentAttemptSmallResult | null> {
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
				id: attempt.test!.id,
				managerId: attempt.test!.managerId,
				title: attempt.test!.title,
				description: attempt.test!.description,
				minutesToAnswer: attempt.test!.minutesToAnswer,
				difficulty: attempt.test!.difficulty,
				createdAt: attempt.test!.createdAt,
				updatedAt: attempt.test!.updatedAt,
			},
			questions: attempt.answerQuestions!.map(answer => ({
				id: answer.question!.id,
				text: answer.question!.text,
				options: answer.question!.options!.map((option, index) => ({ id: index, text: option })),
				points: answer.question!.points,
				chosenOption: answer.chosenOption,
			})),
			startedAt: attempt.createdAt,
			endedAt: AttemptLogic.getEndDate(attempt),
		};
	}
}
