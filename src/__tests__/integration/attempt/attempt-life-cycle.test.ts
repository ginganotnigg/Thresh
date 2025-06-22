import { PatchAttemptSubmitHandler } from "../../../controllers/attempts/uc_command/patch-attempt-submit/handler";
import { PostAttemptAnswersHandler } from "../../../controllers/attempts/uc_command/post-attempt-answers/handler";
import { PostAttemptsHandler } from "../../../controllers/attempts/uc_command/post-attempts/handler";
import { GetAttemptAnswersQueryHandler } from "../../../controllers/attempts/uc_query/get-attempt-answers-query/handler";
import { GetAttemptQueryHandler } from "../../../controllers/attempts/uc_query/get-attempt-query/handler";
import { PostExamParticipantHandler } from "../../../controllers/tests/uc_command/post-exam-participant/handler";
import { PostTestHandler } from "../../../controllers/tests/uc_command/post-test/handler";
import { GetTestQuestionsHandler } from "../../../controllers/tests/uc_query/get-test-questions/handler";
import { GetTestQueryHandler } from "../../../controllers/tests/uc_query/get-test/handler";
import { CredentialsMeta } from "../../../shared/schemas/meta";
import { postExamData } from "../../data/post-test-data";
import { setupAfterAll, setupBeforeAll } from "../setup";

describe("Attempt Life Cycle", () => {
	const credentials: CredentialsMeta = { userId: "1", role: "MANAGER" };

	beforeAll(async () => {
		await setupBeforeAll();
	});

	afterAll(async () => {
		await setupAfterAll();
	});

	it("should do the attempt life cycle", async () => {
		const exam = postExamData;
		const { testId } = await new PostTestHandler()
			.withCredentials(credentials)
			.handle(exam);
		;
		await new PostExamParticipantHandler()
			.withCredentials(credentials)
			.withId(testId)
			.handle({
				password: "secret123",
			});
		const { attemptId } = await new PostAttemptsHandler()
			.withCredentials(credentials)
			.handle({
				testId,
			});
		const testQuestions = await new GetTestQuestionsHandler()
			.withCredentials(credentials)
			.withId(testId)
			.handle({ viewCorrectAnswer: "0" });

		for (const question of testQuestions) {
			await new PostAttemptAnswersHandler()
				.withId(attemptId)
				.withCredentials(credentials)
				.handle({
					questionId: question.id,
					answer: question.type === "MCQ"
						? {
							type: "MCQ",
							chosenOption: 1,
						}
						: {
							type: "LONG_ANSWER",
							answer: "Sample answer for long answer question.",
						}
				});
		}

		await new PatchAttemptSubmitHandler()
			.withCredentials(credentials)
			.withId(attemptId)
			.handle();

		// Verify that the attempt is submitted

		const attempt = await new GetAttemptQueryHandler()
			.withCredentials(credentials)
			.withId(attemptId)
			.handle();

		expect(attempt.status === "IN_PROGRESS").not.toBeTruthy();

		const answers = await new GetAttemptAnswersQueryHandler()
			.withCredentials(credentials)
			.withId(attemptId)
			.handle();

		expect(answers).toHaveLength(testQuestions.length);

		const test = await new GetTestQueryHandler()
			.withCredentials(credentials)
			.withId(testId)
			.handle({ viewPassword: "0" });

		expect(test._aggregate.totalAttempts).toBe(1);
	});
});