import { db } from "../../../configs/orm/kysely/db";

export class UniqueExamCheck {
	static async isRoomIdUnique(roomId: string, openDate: Date, closeDate: Date): Promise<boolean> {
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

		return exists === undefined;
	}
}