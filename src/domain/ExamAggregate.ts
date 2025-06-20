import { AggregateRoot } from "../shared/domain";
import { IdentityUtils } from "../shared/domain/UniqueEntityId";
import { DomainError } from "../shared/errors/domain.error";
import { ExamDto, ExamMapper, ExamPersistence } from "./_mappers/ExamMapper";

export class ExamAggregate extends AggregateRoot {
	private addedParticipants: string[] = [];
	private removedParticipants: string[] = [];

	private constructor(
		id: string,
		private dto: ExamDto,
		private participantIds: string[],
	) { super(id); }

	private checkOpen(): void {
		const now = new Date();
		if (this.dto.openDate <= now && this.dto.closeDate >= now) {
			throw new DomainError("Exam is not open for participation.");
		}
	}

	public static create(dto: ExamDto): ExamAggregate {
		const id = IdentityUtils.create();
		return new ExamAggregate(id, dto, []);
	}

	public static fromPersistence(persistence: ExamPersistence, participantIds: string[]): ExamAggregate {
		return new ExamAggregate(persistence.testId, persistence, participantIds);
	}

	public toPersistence(): {
		exam: ExamPersistence;
		addedParticipants: string[];
		removedParticipants: string[];
	} {
		return {
			exam: ExamMapper.toPersistence(this.dto, this.id),
			addedParticipants: this.addedParticipants,
			removedParticipants: this.removedParticipants,
		};
	}

	public addParticipant(participantId: string, password?: string | null): void {
		this.checkOpen();
		if (this.dto.password && this.dto.password !== password) {
			throw new DomainError("Incorrect password for the exam.");
		}
		if (this.participantIds.includes(participantId)) {
			throw new DomainError(`Participant ${participantId} is already added.`);
		}
		if (this.removedParticipants.includes(participantId)) {
			this.removedParticipants = this.removedParticipants.filter(id => id !== participantId);
		}
		else if (this.addedParticipants.includes(participantId)) {
			return; // Already added, no need to add again
		}
		this.addedParticipants.push(participantId);
	}

	public removeParticipant(participantId: string): void {
		if (!this.participantIds.includes(participantId)) {
			throw new DomainError(`Participant ${participantId} is not part of the exam.`);
		}
		if (this.addedParticipants.includes(participantId)) {
			this.addedParticipants = this.addedParticipants.filter(id => id !== participantId);
		}
		else if (this.removedParticipants.includes(participantId)) {
			return; // Already removed, no need to remove again
		}
		this.removedParticipants.push(participantId);
	}
}