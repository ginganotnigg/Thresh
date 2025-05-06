-- Active: 1746460936041@@127.0.0.1@3306@skillsharp_thresh
SELECT
	SUM(q.points) as res
FROM
	Attempts_answer_Questions as aaq
	JOIN Questions as q ON q.id = aaq.questionId
WHERE aaq.`chosenOption` = q.`correctOption`
	AND aaq.attemptId = :attemptId
GROUP BY
	aaq.attemptId