import { AttemptService } from '../domain/domain.service';
import { IRetriverRepository } from '../domain/contracts/retriver.repo.i';
import { IWriteRepository } from '../domain/contracts/write.repo.i';
import { AnswerAttemptParam } from './schemas/param';
import { eventDispatcherInstance } from '../../../common/event/event-queue';
import { ProcessAnsweredEvent } from '../domain/events/process-answered.event';

export default class CommandUsecase {
	constructor(
		private readonly retriver: IRetriverRepository,
		private readonly write: IWriteRepository,
		private readonly attemptService: AttemptService
	) { }

	/**
	 * Quit the previous test process of a candidate (if any) and re-create a new currently In Progress attempt
	 */
	async startNew(testId: number, candidateId: string): Promise<void> {
		// Find previous attempt and evaluate it if it exists
		const previousAttemptId = await this.retriver.getInProgressAttemptId(testId, candidateId);
		if (previousAttemptId != null) {
			await this.attemptService.evaluateTestAttempt(previousAttemptId);
		}
		await this.write.createNewAttemptForCandidate(testId, candidateId);
		const attemptId = await this.retriver.getInProgressAttemptId(testId, candidateId);
		if (attemptId == null) {
			throw new Error('Attempt is not yet started');
		}
		this.attemptService.scheduleAttemptEvaluation(attemptId);
	}

	async answer(param: AnswerAttemptParam, candidateId: string) {
		const { testId, questionId, optionId } = param;
		const attemptId = await this.retriver.getInProgressAttemptId(testId, candidateId);
		if (attemptId == null) {
			throw new Error('Attempt to answer is not found');
		}
		await this.write.answerOnAttempt(attemptId, questionId, optionId);
		eventDispatcherInstance.dispatch(new ProcessAnsweredEvent(attemptId, questionId, optionId));
	}

	async submit(testId: number, candidateId: string) {
		const attemptId = await this.retriver.getInProgressAttemptId(testId, candidateId);
		if (attemptId == null) {
			throw new Error('Attempt to submit is not found');
		}
		await this.attemptService.evaluateTestAttempt(attemptId);
	}
}