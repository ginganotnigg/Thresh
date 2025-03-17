import { DomainErrorResponse } from "../../controller/errors/domain.error";
import { eventDispatcherInstance } from "../../library/cayduajs/event/event-queue";
import { AttemptStatus } from "../enum";
import Attempt from "../models/attempt";
import AttemptsAnswerQuestions from "../models/attempts_answer_questions";
import Test from "../models/test";
import { AttemptAnsweredEvent, AttemptEndedEvent, AttemptStartedEvent } from "./current-attempt.events";

export class CurrentAttemptDomain {
	private readonly id: number;
	private readonly createdAt: Date;
	private readonly minutesToAnswer: number;

	private constructor(id: number, createdAt: Date, minutesToAnswer: number) {
		this.id = id;
		this.createdAt = createdAt;
		this.minutesToAnswer = minutesToAnswer;
	}

	static async startNew(testId: number, candidateId: string) {
		const previousAttempt = await CurrentAttemptDomain.load(testId, candidateId);
		if (previousAttempt != null) {
			await previousAttempt.endAttempt();
		}
		const attempt = await Attempt.create({
			testId: +testId,
			candidateId: candidateId,
			status: AttemptStatus.IN_PROGRESS,
			secondsSpent: 0,
		});
		const attempt2 = await Attempt.findByPk(attempt.id, {
			include: {
				model: Test,
				attributes: ['minutesToAnswer'],
			}
		});
		if (attempt2 == null) {
			throw new DomainErrorResponse("Attempt failed to start");
		}
		const currentAttempt = new CurrentAttemptDomain(attempt2.id, attempt2.createdAt, attempt2.Test!.minutesToAnswer!);
		eventDispatcherInstance.dispatch(new AttemptStartedEvent(
			currentAttempt.id,
			currentAttempt.getEndDate()
		));
	}

	static async load(testId: number, candidateId: string) {
		const attempt = await Attempt.findOne({
			where: {
				testId: testId,
				candidateId: candidateId,
				status: AttemptStatus.IN_PROGRESS
			},
			include: {
				model: Test,
				attributes: ['minutesToAnswer'],
			}
		});
		if (attempt == null) {
			return null;
		}
		return new CurrentAttemptDomain(attempt.id, attempt.createdAt, attempt.Test!.minutesToAnswer!);
	}

	static async loadByIdStrict(attemptId: number) {
		const currentAttempt = await Attempt.findOne({
			where: {
				id: attemptId,
				status: AttemptStatus.IN_PROGRESS
			},
			include: {
				model: Test,
				attributes: ['minutesToAnswer'],
			}
		})
		if (currentAttempt == null) {
			throw new DomainErrorResponse("Attempt not found");
		}
		return new CurrentAttemptDomain(currentAttempt.id, currentAttempt.createdAt, currentAttempt.Test!.minutesToAnswer!);
	}

	static async loadStrict(testId: number, candidateId: string) {
		const currentAttempt = await this.load(testId, candidateId);
		if (currentAttempt == null) {
			throw new DomainErrorResponse("Attempt not found");
		}
		return currentAttempt;
	}

	getEndDate() {
		const endDate = new Date(this.createdAt.getTime() + this.minutesToAnswer * 60 * 1000);
		return endDate;
	}

	getSecondsSpent() {
		const now = new Date();
		if (now.getTime() < this.createdAt.getTime()) {
			throw new Error("Invalid time");
		}
		if (now.getTime() > this.getEndDate().getTime()) {
			return this.minutesToAnswer * 60;
		}
		const secondsSpent = Math.floor((now.getTime() - this.createdAt.getTime()) / 1000);
		return secondsSpent;
	}

	async endAttempt() {
		await Attempt.update(
			{
				status: AttemptStatus.COMPLETED,
				secondsSpent: this.getSecondsSpent()
			},
			{ where: { id: this.id } }
		);
		eventDispatcherInstance.dispatch(new AttemptEndedEvent(this.id));
	}

	async answerAttempt(questionId: number, optionId?: number) {
		if (optionId == null) {
			await AttemptsAnswerQuestions.destroy({
				where: {
					attemptId: this.id,
					questionId: questionId
				}
			});
			return;
		}
		await AttemptsAnswerQuestions.upsert(
			{
				attemptId: this.id,
				questionId: questionId,
				chosenOption: optionId,
			},
		);
		eventDispatcherInstance.dispatch(new AttemptAnsweredEvent(this.id, questionId, optionId));
	}
}