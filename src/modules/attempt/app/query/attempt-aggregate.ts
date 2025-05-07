import sequelize from "../../../../configs/orm/sequelize/sequelize";
import { QueryTypes } from "sequelize";
import { AttemptAggregateQuery, AttemptAggregateResponse } from "../../schema/controller-schema";
import fs from "fs";
import path from "path";
import Attempt from "../../../../domain/models/attempt";

const sqlDir = path.join(__dirname, "sql");

export async function queryAttemptAggregate(attemptId: string, option: AttemptAggregateQuery): Promise<AttemptAggregateResponse> {
	const attempt = await Attempt.findOne({
		where: { id: attemptId },
		attributes: ["id"],
	});
	if (!attempt) {
		throw new Error(`Attempt with ID ${attemptId} not found`);
	}

	const { score, answered, answeredCorrect } = option;
	const result: AttemptAggregateResponse = {};

	const getScoreSql = fs.readFileSync(path.join(sqlDir, "getScore.sql"), "utf8");
	const getNumberOfAnswers = fs.readFileSync(path.join(sqlDir, "getNumberOfAnswers.sql"), "utf8");
	const getNumberOfCorrectAnswers = fs.readFileSync(path.join(sqlDir, "getNumberOfCorrectAnswers.sql"), "utf8");


	if (score) {
		const scoreResult = await sequelize.query(getScoreSql,
			{
				replacements: { attemptId },
				type: QueryTypes.SELECT,
			}
		);
		result.score = (scoreResult[0] as any)?.res || undefined;
	}
	if (answered) {
		const answeredResult = await sequelize.query(
			getNumberOfAnswers,
			{
				replacements: { attemptId },
				type: QueryTypes.SELECT,
			}
		);
		result.answered = (answeredResult[0] as any)?.res || undefined;
	}

	if (answeredCorrect) {
		const answeredCorrectResult = await sequelize.query(getNumberOfCorrectAnswers,
			{
				replacements: { attemptId },
				type: QueryTypes.SELECT,
			}
		);
		result.answeredCorrect = (answeredCorrectResult[0] as any)?.res || undefined;
	}

	return result;
}
