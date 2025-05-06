import { QueryTypes } from "sequelize";
import sequelize from "../../../configs/orm/sequelize";
import { AttemptAggregateQuery, AttemptAggregateResponse } from "../schema";
import fs from "fs";
import path from "path";

const sqlDir = path.join(__dirname, "sql");

export async function queryAttemptAggregate(attemptId: string, option: AttemptAggregateQuery): Promise<AttemptAggregateResponse> {
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
		result.score = (scoreResult[0] as any).res;
	}
	if (answered) {
		const answeredResult = await sequelize.query(
			getNumberOfAnswers,
			{
				replacements: { attemptId },
				type: QueryTypes.SELECT,
			}
		);
		result.answered = (answeredResult[0] as any).res;
	}

	if (answeredCorrect) {
		const answeredCorrectResult = await sequelize.query(getNumberOfCorrectAnswers,
			{
				replacements: { attemptId },
				type: QueryTypes.SELECT,
			}
		);
		result.answeredCorrect = (answeredCorrectResult[0] as any).res;
	}

	return result;
}
