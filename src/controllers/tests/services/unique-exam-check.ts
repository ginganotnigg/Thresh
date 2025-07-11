import { db } from "../../../configs/orm/kysely/db";

export class UniqueExamCheck {
	static async isRoomIdUnique(roomId: string, openDate: Date, closeDate: Date, currentExamId?: string): Promise<boolean> {
		const exists = await db
			.selectFrom("ExamTests")
			.where("roomId", "=", roomId)
			.where(eb => eb(
				"openDate", "<=", closeDate
			).and(
				"closeDate", ">=", openDate
			))
			.selectAll()
			.executeTakeFirst();

		if (exists == null) {
			return true;
		}
		if (currentExamId != null && exists.testId === currentExamId) {
			return true; // Allow update of the same exam
		}

		return false;
	}
}