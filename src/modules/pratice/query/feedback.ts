import Feedback from "../../../domain/models/feedback";
import { FeedbackCore } from "../../../domain/schema/core.schema";

export default async function queryFeedback(params: { practiceTestId: string }): Promise<FeedbackCore | null> {
	const { practiceTestId } = params;
	const feedbacks = await Feedback.findByPk(practiceTestId);

	if (!feedbacks) {
		return null;
	}
	return {
		...feedbacks.get(),
	};
}