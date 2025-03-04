import Attempt from '../../../models/attempt';
import AttemptsAnswerQuestions from '../../../models/attempts_answer_questions';
import Question from '../../../models/question';
import Test from '../../../models/test';
import { AttemptStatus } from '../../../common/domain/enum';
import { CurrentAttemptDetailResponse, CurrentAttemptSmallResponse } from '../controllers/schemas/response';

export class ProcessQueryService {
	static async getInProgressAttemptId(testId: number, candidateId: string): Promise<number | null> {
		const result = await Attempt.findOne({
			where: {
				testId: testId,
				candidateId: candidateId,
				status: AttemptStatus.IN_PROGRESS
			},
			attributes: ['id']
		});
		if (!result) {
			return null;
		}
		return result.getDataValue('id')!;
	}

	static async getAllInProgress(): Promise<CurrentAttemptSmallResponse[]> {
		const attempts = await Attempt.findAll({
			where: {
				status: AttemptStatus.IN_PROGRESS
			},
			attributes: ['id', 'createdAt'],
			include: [{
				model: Test,
				attributes: ['minutesToAnswer'],
			}]
		});
		return attempts.map(attempt => {
			return {
				id: attempt.id,
				startedAt: attempt.createdAt,
				endedAt: new Date(attempt.createdAt.getTime() + (attempt.Test!.minutesToAnswer! * 60 * 1000)),
			}
		});
	}

	static async getInProgressAttemptSmallById(attemptId: number): Promise<CurrentAttemptSmallResponse> {
		const attempt = await Attempt.findByPk(attemptId, {
			attributes: ['id', 'createdAt'],
			include: [{
				model: Test,
				attributes: ['minutesToAnswer'],
			}]
		});
		if (attempt == null) {
			throw new Error('Attempt not found');
		}
		return {
			id: attempt.id,
			startedAt: attempt.createdAt,
			endedAt: new Date(attempt.createdAt.getTime() + (attempt.Test!.minutesToAnswer! * 60 * 1000)),
		};
	}

	static async getInProgressAttemptSmall(testId: number, candidateId: string): Promise<CurrentAttemptSmallResponse | null> {
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
		const endDate = new Date(attempt.createdAt.getTime() + (attempt.Test!.minutesToAnswer! * 60 * 1000));
		return {
			id: attempt.id,
			startedAt: attempt.createdAt,
			endedAt: endDate,
		};
	}

	static async getInProgressAttemptToDo(testId: number, candidateId: string): Promise<CurrentAttemptDetailResponse> {
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
			endedAt: new Date(attempt.createdAt.getTime() + (attempt.Test!.minutesToAnswer! * 60 * 1000)),
		};
	}
}
