-- Active: 1746460936041@@127.0.0.1@3306@skillsharp_thresh
SELECT
	COUNT(DISTINCT aaq.questionId) as res
FROM
	Attempts_answer_Questions as aaq
WHERE
	aaq.attemptId = :attemptId