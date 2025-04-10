import { AttemptStatus } from '../../../domain/enum';
import { TestDetailToDoResponse, CurrentAttemptStateResponse } from '../controllers/schemas/response';
import { AttemptSchedule } from '../controllers/schemas/dto';
import Test from '../../../domain/models/test';
import { DomainErrorResponse } from '../../../controller/errors/domain.error';
import Attempt from '../../../domain/models/attempt';
import AttemptsAnswerQuestions from '../../../domain/models/attempts_answer_questions';
import Question from '../../../domain/models/question';
import { CurrentAttemptCompute } from '../../../domain/current-attempt/current-attempt.compute';

const { getEndDate, getSecondsLeft } = CurrentAttemptCompute;

export class CurrentQueryService {
	static async isAttemptInProgress(attemptId: number): Promise<boolean> {
		const result = await Attempt.findOne({
			where: {
				id: attemptId,
				status: AttemptStatus.IN_PROGRESS
			},
		});
		if (!result) {
			return false;
		}
		return true;
	}

	static async loadAttemptsForSchedule(): Promise<AttemptSchedule[]> {
		const attempts = await Attempt.findAll({
			where: {
				status: AttemptStatus.IN_PROGRESS
			},
			attributes: ['id', 'createdAt'],
			include: {
				model: Test,
				attributes: ['minutesToAnswer'],
			}
		});
		return attempts.map(attempt => new AttemptSchedule(attempt.id, getEndDate(attempt, attempt.Test!.minutesToAnswer)));
	}

	static async getCurrentAttemptState(candidateId: string): Promise<CurrentAttemptStateResponse> {
		const attempt = await Attempt.findOne({
			where: {
				candidateId: candidateId,
				status: AttemptStatus.IN_PROGRESS,
			},
			attributes: ['id', 'status', 'createdAt'],
			include: [
				{
					model: Test,
					attributes: ['minutesToAnswer', 'id', 'title'],
				},
				{
					model: AttemptsAnswerQuestions,
					attributes: ['questionId', 'chosenOption'],
				}
			]
		});
		if (attempt == null) {
			return {
				hasCurrentAttempt: false,
				currentAttempt: null,
			}
		}
		const minutesToAnswer = attempt.Test!.minutesToAnswer!;
		const endedAt = getEndDate(attempt, minutesToAnswer);
		const secondsLeft = getSecondsLeft(attempt, minutesToAnswer);
		const answers = attempt.Attempts_answer_Questions!.map(answer => ({
			questionId: answer.questionId,
			chosenOption: answer.chosenOption,
		}));
		return {
			hasCurrentAttempt: true,
			currentAttempt: {
				id: attempt.id,
				secondsLeft,
				endedAt,
				createdAt: attempt.createdAt,
				answers,
				test: {
					id: attempt.Test!.id,
					title: attempt.Test!.title,
					minutesToAnswer,
				}
			},
		};
	}

	static async getTestDetailToDo(candidateId: string): Promise<TestDetailToDoResponse> {
		const attempt = await Attempt.findOne({
			where: {
				candidateId: candidateId,
				status: AttemptStatus.IN_PROGRESS,
			},
			include: [
				{
					model: Test,
					include: [{
						model: Question,
						attributes: { exclude: ['correctOption'] }
					}]
				},
			]
		});
		if (attempt == null) {
			throw new DomainErrorResponse('Attempt not found');
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
			questions: attempt.Test!.Questions!.map(question => ({
				id: question.id,
				text: question.text,
				options: question.options!.map((option, index) => ({ id: index, text: option })),
				points: question.points,
			})),
		};
	}
}
