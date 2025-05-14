import sequelize from "../../../../configs/orm/sequelize/sequelize";
import { QueryTypes } from "sequelize";
import { AttemptAggregateQuery, AttemptAggregateResponse } from "../../schema";
import fs from "fs";
import path from "path";
import Attempt from "../../../../domain/models/attempt";
import { DomainError } from "../../../../controller/errors/domain.error";

const sqlDir = path.join(__dirname, "sql");

export async function queryAttemptAggregate(attemptId: string, option: AttemptAggregateQuery): Promise<AttemptAggregateResponse> {
	const attempt = await Attempt.findOne({
		where: { id: attemptId },
	});
	if (!attempt) {
		throw new DomainError(`Attempt with ID ${attemptId} not found`);
	}
	if (attempt.hasEnded === false) {
		throw new DomainError(`Attempt is not ended, cannot aggregate results`);
	}

	const { score, answered, answeredCorrect } = option;
	const result: AttemptAggregateResponse = {};

	if (score) {
		const getScoreSql = fs.readFileSync(path.join(sqlDir, "getScore.sql"), "utf8");
		const scoreResult = await sequelize.query(getScoreSql,
			{
				replacements: { attemptId },
				type: QueryTypes.SELECT,
			}
		);
		result.score = parseInt((scoreResult[0] as any)?.res) || undefined;
	}
	if (answered) {
		const getNumberOfAnswers = fs.readFileSync(path.join(sqlDir, "getNumberOfAnswers.sql"), "utf8");
		const answeredResult = await sequelize.query(
			getNumberOfAnswers,
			{
				replacements: { attemptId },
				type: QueryTypes.SELECT,
			}
		);
		result.answered = parseInt((answeredResult[0] as any)?.res) || undefined;
	}
	if (answeredCorrect) {
		const getNumberOfCorrectAnswers = fs.readFileSync(path.join(sqlDir, "getNumberOfCorrectAnswers.sql"), "utf8");
		const answeredCorrectResult = await sequelize.query(getNumberOfCorrectAnswers,
			{
				replacements: { attemptId },
				type: QueryTypes.SELECT,
			}
		);
		result.answeredCorrect = parseInt((answeredCorrectResult[0] as any)?.res) || undefined;
	}

	return result;
}
