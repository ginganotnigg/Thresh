import { Op } from "sequelize";
import { DomainError } from "../../../controller/errors/domain.error";
import ExamTest from "../../../domain/models/exam_test";
import Test from "../../../domain/models/test";
import { ExamTestInfo } from "../../../domain/schema/info.schema";

export default async function queryFind(roomId: string): Promise<ExamTestInfo> {
	const now = new Date();
	const examTest = await ExamTest.findAll({
		where: {
			roomId,
			openDate: {
				[Op.lte]: now,
			},
			closeDate: {
				[Op.gte]: now,
			},
		},
		include: [{
			model: Test,
			required: true,
		}]
	});
	if (examTest.length === 0) {
		throw new DomainError("No exam test found");
	}
	if (examTest.length > 1) {
		throw new Error("Multiple exam tests found");
	}
	return {
		...examTest[0].get(),
		...examTest[0].Test!.get(),
		hasPassword: examTest[0].password !== null,
	};
}
