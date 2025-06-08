import { db } from "../../../../configs/orm/kysely/db";
import { DomainError } from "../../../../shared/controller/errors/domain.error";
import { CredentialsMeta } from "../../../../shared/controller/schemas/meta";
import { PolicyBase } from "../../base/policy.base";
import { ExamParticipantPolicy } from "./ExamParticipantPolicy";
import { PracticeParticipantPolicy } from "./PracticeParticipantPolicy";

export class ParticipantPolicyFactory {
	constructor(
		private readonly credentials: CredentialsMeta,
	) { }

	async createFromTestId(testId: string): Promise<PolicyBase> {
		const test = await db.selectFrom("Tests")
			.selectAll()
			.where("id", "=", testId)
			.executeTakeFirst();

		if (test == null) {
			throw new DomainError(`Test with id ${testId} not found.`);
		}
		if (test.mode !== "exam" && test.mode !== "practice") {
			throw new DomainError(`Invalid test mode: ${test.mode}`);
		}

		return this.createFromTest({
			testId: test.id,
			authorId: test.authorId,
			mode: test.mode,
		});
	}

	async createFromTest({
		testId, authorId, mode
	}: {
		testId: string; authorId: string; mode: string;
	}): Promise<PolicyBase> {
		if (mode === "exam") {
			const participantIdsQuery = await db.selectFrom("ExamParticipants")
				.select("ExamParticipants.candidateId")
				.where("ExamParticipants.testId", "=", testId)
				.execute();

			const participantIds = participantIdsQuery.map(row => row.candidateId);
			return new ExamParticipantPolicy(this.credentials, authorId, participantIds);
		} else if (mode === "practice") {
			return new PracticeParticipantPolicy(this.credentials, authorId);
		}
		return Promise.reject(new DomainError("Invalid test mode specified."));
	}
}