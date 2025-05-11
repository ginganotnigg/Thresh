import { CurrentAttemptDomain } from "../../../../domain/core/domain/current-attempt.domain";

export default async function commandAnswerAttempt({
	testId,
	candidateId,
	questionId,
	chosenOption,
}: {
	testId: string;
	candidateId: string;
	questionId: number;
	chosenOption?: number;
}): Promise<void> {
	const currentAttempt = await CurrentAttemptDomain.load({
		testId,
		candidateId,
	});
	await currentAttempt.answerQuestion({
		questionId,
		chosenOption,
	});
}