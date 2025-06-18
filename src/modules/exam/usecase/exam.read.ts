import { DomainError } from "../../../shared/errors/domain.error";
import { Paged, Paging } from "../../../shared/controller/schemas/base";
import { CredentialsMeta } from "../../../shared/schemas/meta";
import ExamParticipants from "../../../infrastructure/models/exam_participants";
import ExamTest from "../../../infrastructure/models/exam_test";
import Test from "../../../infrastructure/models/test";
import { ExamPolicy } from "../../../domain/policy/exam.policy";
import { TestQueryRepo } from "../../../infrastructure/read/test.query-repo";
import { TestAggregate, TestQuestionsAggregate } from "../../../shared/resource/test.schema";
import { QuestionCore } from "../../../shared/resource/question.schema";
import { QuestionToDo } from "../../../shared/resource/question.schema";

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
				include: [{
					model: ExamParticipants,
					required: false,
				}],
			}]
		});
		if (!test) {
			throw new DomainError("Exam test not found");
		}

		return new ExamRead(test, credentials);
	}

	async getParticipants(paging: Paging): Promise<Paged<string>> {
		this.examPolicy.checkAllowedToSeeOthersResults();
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

	async getTestQuestionsAggregate(): Promise<TestQuestionsAggregate[]> {
		await this.examPolicy.checkIsAllowedToSeeCorrectAnswers();
		const testQuestionsAggregate = await TestQueryRepo.getTestQuestionsAggregate(this.test.id);
		return testQuestionsAggregate;
	}

	async getAggregate(): Promise<TestAggregate> {
		this.examPolicy.checkIsAllowedToSeeExam();
		const testAggregate = await TestQueryRepo.getTestAggregate(this.test.id);
		return testAggregate;
	}
}