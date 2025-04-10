import { AnswerAttemptBody } from '../controllers/schemas/request';
import { CurrentAttemptDomain } from '../../../domain/current-attempt/current-attempt.domain';

export class ProcessCommandService {
	static async startNew(testId: number, candidateId: string): Promise<void> {
		await CurrentAttemptDomain.startNew(testId, candidateId);
	}

	static async answer(attemptId: number, param: AnswerAttemptBody) {
		const { questionId, optionId } = param;
		const attempt = await CurrentAttemptDomain.loadByIdStrict(attemptId);
		await attempt.answerAttempt(questionId, optionId);
	}

	static async submit(candidateId: string) {
		const attempt = await CurrentAttemptDomain.loadStrict(candidateId);
		await attempt.endAttempt();
	}

	static async timesUp(attemptId: number) {
		const attempt = await CurrentAttemptDomain.loadByIdStrict(attemptId);
		await attempt.endAttempt();
	}
}