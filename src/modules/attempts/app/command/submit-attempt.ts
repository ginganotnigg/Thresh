import { CurrentAttemptDomain } from "../../../../domain/core/domain/current-attempt.domain";

export default async function commandSubmitAttempt({
	testId,
	candidateId,
}: {
	testId: string;
	candidateId: string;
}): Promise<void> {
	const attempt = await CurrentAttemptDomain.load({ testId, candidateId });
	await attempt.submit();
}