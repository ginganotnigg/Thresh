-- Active: 1746460936041@@127.0.0.1@3306@skillsharp_thresh
SELECT
	COUNT(DISTINCT aaq.questionId) as res
FROM
	Attempts_answer_Questions as aaq
	JOIN Questions as q ON q.id = aaq.questionId
WHERE
	aaq.`attemptId` = :attemptId
	AND aaq.`chosenOption` = q.`correctOption`