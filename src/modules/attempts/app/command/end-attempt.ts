import Attempt from "../../../../domain/models/attempt";

export default async function commandEndAttempt({
	attemptId,
}: {
	attemptId: string;
}): Promise<void> {
	const attempt = await Attempt.findByPk(attemptId);
	if (!attempt) {
		return;
	}
	await attempt.update({
		hasEnded: true,
	});
	await attempt.save();
}
