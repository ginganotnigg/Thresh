import { AnswerForQuestionCommon } from "../../../schemas/common/answer-for-question-type";

class AnswerQueueItem {
	constructor(
		public readonly attemptId: string,
		public readonly questionId: number,
		public readonly answer: AnswerForQuestionCommon | undefined,
	) { }
}

export class AnswerQueueService {
	private readonly attemptQueueMap: Map<
		string,
		Map<number, AnswerQueueItem>
	>;

	private static instance: AnswerQueueService;
	private constructor() {
		this.attemptQueueMap = new Map<string, Map<number, AnswerQueueItem>>();
	}

	static getInstance(): AnswerQueueService {
		if (!AnswerQueueService.instance) {
			AnswerQueueService.instance = new AnswerQueueService();
		}
		return AnswerQueueService.instance;
	}

	set(attemptId: string, questionId: number, answer: AnswerForQuestionCommon | undefined): void {
		if (!this.attemptQueueMap.has(attemptId)) {
			this.attemptQueueMap.set(attemptId, new Map<number, AnswerQueueItem>());
		}
		const questionQueueMap = this.attemptQueueMap.get(attemptId);
		if (questionQueueMap) {
			questionQueueMap.set(questionId, new AnswerQueueItem(attemptId, questionId, answer));
		}
	}

	get(attemptId: string, questionId: number): AnswerForQuestionCommon | undefined {
		const questionQueue = this.attemptQueueMap.get(attemptId);
		if (questionQueue) {
			const item = questionQueue.get(questionId);
			if (item) {
				return item.answer;
			}
		}
		return undefined;
	}

	delete(attemptId: string, questionId: number): void {
		const questionQueue = this.attemptQueueMap.get(attemptId);
		if (questionQueue) {
			questionQueue.delete(questionId);
			if (questionQueue.size === 0) {
				this.attemptQueueMap.delete(attemptId);
			}
		}
	}

	private hasPendingAnswers(attemptId: string): boolean {
		const questionQueue = this.attemptQueueMap.get(attemptId);
		if (!questionQueue) {
			return false;
		}
		return questionQueue.size > 0;
	}

	waitForPendingAnswers(attemptId: string): Promise<void> {
		return new Promise((resolve) => {
			const checkQueue = () => {
				if (this.hasPendingAnswers(attemptId) === false) {
					console.log(`No pending answers for attempt ${attemptId}, resolving...`);
					resolve();
				} else {
					console.log(`Waiting for pending answers for attempt ${attemptId}...`);
					setTimeout(checkQueue, 1000);
				}
			};
			checkQueue();
		});
	}
}
