import { DomainError } from "../../../controller/errors/domain.error";
import { Paged, Paging } from "../../../controller/schemas/base";
import { CredentialsMeta } from "../../../controller/schemas/meta";
import ExamParticipants from "../../../domain/models/exam_participants";
import ExamTest from "../../../domain/models/exam_test";
import Test from "../../../domain/models/test";
import { ExamPolicy } from "../../../domain/policy/exam.policy";
import { TestQueryRepo } from "../../../domain/repo/test/test.query-repo";
import { QuestionCore } from "../../../domain/schema/core.schema";
import { QuestionToDo } from "../../../domain/schema/variants.schema";

export class ExamRead {
	private readonly examPolicy: ExamPolicy;

	private constructor(
		private readonly test: Test,
		private readonly credentials: CredentialsMeta,
	) {
		this.examPolicy = new ExamPolicy(test, credentials);
	}

	static async load(testId: string, credentials: CredentialsMeta): Promise<ExamRead> {
		const test = await Test.findByPk(testId, {
			include: [{
				model: ExamTest,
				required: true,
			}]
		});
		if (!test) {
			throw new DomainError("Exam test not found");
		}

		return new ExamRead(test, credentials);
	}

	async getParticipants(paging: Paging): Promise<Paged<string>> {
		this.examPolicy.checkAllowedToSeeParticipants();
		const { page, perPage } = paging;
		const testId = this.test.id;
		const { rows, count } = await ExamParticipants.findAndCountAll({
			where: {
				testId,
			},
			limit: perPage,
			offset: (page - 1) * perPage,
			order: [["createdAt", "DESC"]],
		});

		const participants = rows.map((participant) => participant.candidateId);
		return {
			page,
			perPage,
			total: count,
			totalPages: Math.ceil(count / perPage),
			data: participants,
		}
	}

	async getQuestionsToDo(): Promise<QuestionToDo[]> {
		await this.examPolicy.checkIsAllowedToSeeQuestions();
		return await TestQueryRepo.getQuestionsToDo(this.test.id);
	}

	async getQuestionsWithAnswers(): Promise<QuestionCore[]> {
		await this.examPolicy.checkIsAllowedToSeeCorrectAnswers();
		return await TestQueryRepo.getQuestions(this.test.id);
	}
}