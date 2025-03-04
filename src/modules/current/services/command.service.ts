import { WriteRepository } from '../infra/repository';
import { EventController } from '../controllers/event.controller';
import { ProcessQueryService } from './query.service';
import { AnswerAttemptBody } from '../controllers/schemas/request';

export class ProcessCommandService {
	static async evaluateAttempt(attemptId: number): Promise<void> {
		await WriteRepository.endAttempt(attemptId);
		EventController.ended(attemptId);
	}

	static async startNew(testId: number, candidateId: string): Promise<void> {
		// Find previous attempt and evaluate it if it exists
		const previousAttemptId = await ProcessQueryService.getInProgressAttemptId(testId, candidateId);
		if (previousAttemptId != null) {
			await this.evaluateAttempt(previousAttemptId);
		}
		await WriteRepository.newAttempt(testId, candidateId);
		const attemptId = await ProcessQueryService.getInProgressAttemptId(testId, candidateId);
		if (attemptId == null) {
			throw new Error('Attempt is not yet started');
		}
		EventController.started(attemptId);
	}

	static async answer(testId: number, userId: string, param: AnswerAttemptBody) {
		const { questionId, optionId } = param;
		const attemptId = await ProcessQueryService.getInProgressAttemptId(testId, userId);
		if (attemptId == null) {
			throw new Error('Attempt to answer is not found');
		}
		await WriteRepository.answerAttempt(attemptId, questionId, optionId);
		EventController.answered(attemptId, questionId, optionId);
	}

	static async submit(testId: number, candidateId: string) {
		const attemptId = await ProcessQueryService.getInProgressAttemptId(testId, candidateId);
		if (attemptId == null) {
			throw new Error('Attempt to submit is not found');
		}
		await this.evaluateAttempt(attemptId);
	}
}