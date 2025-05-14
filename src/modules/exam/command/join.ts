import { z } from "zod";
import { ExamTestDomain } from "../../../domain/core/domain/exam-test.domain";

export default async function commandJoin({
	testId,
	password,
	candidateId,
}: {
	testId: string;
	password: string;
	candidateId: string;
}): Promise<void> {
	const examTest = await ExamTestDomain.load({ testId, candidateId });
	if (examTest.hasJoined()) {
		return;
	}
	await examTest.join(password);
}