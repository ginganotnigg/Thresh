import Attempt from "../../../../models/attempt";
import AttemptAnswerQuestions from '../../../../models/attempt_answer_questions';
import Question from '../../../../models/question';
import Test from '../../../../models/test';
import { AttemptStatus } from "../../../../common/domain/enum";
import { IRetriverRepository } from "../../domain/contracts/retriver.repo.i";
import { AttemptLogic } from "../../domain/logic/attempt.logic";

class RetriverRepository implements IRetriverRepository {
	async retriveAllInProgress(): Promise<number[]> {
		const attempts = await Attempt.findAll({
			where: {
				status: AttemptStatus.IN_PROGRESS
			},
			attributes: ['id']
		});
		return attempts.map(attempt => attempt.getDataValue('id')!);
	}

	async getInProgressAttemptId(testId: number, candidateId: string): Promise<number | null> {
		const result = await Attempt.findOne({
			where: {
				testId: testId,
				candidateId: candidateId,
				status: AttemptStatus.IN_PROGRESS
			},
			attributes: ['id']
		});
		if (!result) {
			return null;
		}
		return result.getDataValue('id')!;
	}

	async getEndedDate(attemptId: number): Promise<Date> {
		const result = await Attempt.findByPk(attemptId, {
			attributes: ['createdAt'],
			include: [{
				model: Test,
				attributes: ['minutesToAnswer']
			}]
		});
		if (!result) {
			throw new Error('Attempt not found');
		}
		const endedDate = AttemptLogic.getEndDate(result);
		return endedDate;
	}

	async getCalculatedTotalScore(attemptId: number): Promise<number> {
		const result = await AttemptAnswerQuestions.findAll({
			where: {
				attemptId: attemptId,
				attribute: ['chosenOption']
			},
			include: [{
				model: Question,
				attributes: ['points', 'correctOption']
			}]
		});
		const totalScore = AttemptLogic.getCalculatedTotalScore(result);
		return totalScore;
	}
}

export default RetriverRepository;