export async function scoreLongAnswer(answer: string, correctAnswer: string, points: number): Promise<number> {
	// Simulate a scoring process for a long answer question
	// TODO: use rabbitmq to send the answer to a scoring service
	// For now, we will just compare the answer with the correct answer
	if (answer.trim() === correctAnswer.trim()) {
		return points; // Full points if the answer matches
	}
	return 0; // No points if the answer does not match
}