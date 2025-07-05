import { AnswerForQuestionCommon } from "../../../schemas/common/answer-for-question-type";

class AnswerQueueItem {
	constructor(
		public readonly attemptId: string,
		public readonly questionId: number,
		public readonly answer: AnswerForQuestionCommon | undefined,
		public readonly retries: number
	) { }
}

class Queue extends Map<
	string,
	Map<number, AnswerQueueItem[]>
> { };

export class AnswerQueueService2 {
	private readonly attemptQueueMap: Queue;

	private static instance: AnswerQueueService2;
	private constructor() {
		this.attemptQueueMap = new Queue();
	}

	static getInstance(): AnswerQueueService2 {
		if (!AnswerQueueService2.instance) {
			AnswerQueueService2.instance = new AnswerQueueService2();
		}
		return AnswerQueueService2.instance;
	}

	enqueue(attemptId: string, questionId: number, answer: AnswerForQuestionCommon | undefined, retries: number): void {
		if (!this.attemptQueueMap.has(attemptId)) {
			this.attemptQueueMap.set(attemptId, new Map<number, AnswerQueueItem[]>());
		}
		const questionQueueMap = this.attemptQueueMap.get(attemptId);
		if (questionQueueMap) {
			if (!questionQueueMap.has(questionId)) {
				questionQueueMap.set(questionId, []);
			}
			const queue = questionQueueMap.get(questionId);
			if (queue) {
				queue.push(new AnswerQueueItem(attemptId, questionId, answer, retries));
			}
		}
	}

	peek(attemptId: string, questionId: number): AnswerQueueItem | undefined {
		const questionQueue = this.attemptQueueMap.get(attemptId);
		if (questionQueue) {
			const queue = questionQueue.get(questionId);
			if (queue && queue.length > 0) {
				return queue[0];
			}
		}
		return undefined;
	}

	dequeue(attemptId: string, questionId: number): AnswerQueueItem | undefined {
		const questionQueue = this.attemptQueueMap.get(attemptId);
		if (questionQueue) {
			const queue = questionQueue.get(questionId);
			if (queue && queue.length > 0) {
				const item = queue.shift();
				if (item) {
					if (queue.length === 0) {
						questionQueue.delete(questionId);
					}
					return item;
				}
			}
			if (questionQueue.size === 0) {
				this.attemptQueueMap.delete(attemptId);
			}
		}
		return undefined;
	}

	printQueue(): void {
		console.log("\n");
		console.log("-".repeat(50));
		console.log("Current Answer Queue:");
		for (const [attemptId, questionQueueMap] of this.attemptQueueMap.entries()) {
			console.log(`Attempt ID: ${attemptId}`);
			for (const [questionId, queue] of questionQueueMap.entries()) {
				console.log(` Question ID: ${questionId}, Queue Size: ${queue.length}`);
				for (const item of queue) {
					console.log(`   Answer: ${item.answer?.type}, Retries: ${item.retries}`);
				}
			}
		}
		console.log("-".repeat(50));
		console.log("\n");
	}

	private hasPendingAnswers(attemptId: string): boolean {
		const questionQueue = this.attemptQueueMap.get(attemptId);
		if (questionQueue) {
			for (const queue of questionQueue.values()) {
				if (queue.length > 0) {
					return true;
				}
			}
		}
		return false;
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
