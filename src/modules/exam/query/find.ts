import { Op } from "sequelize";
import { DomainError } from "../../../controller/errors/domain.error";
import ExamTest from "../../../domain/models/exam_test";
import { ExamTestCore } from "../../../domain/schema/core.schema";

export default async function queryFind(roomId: string): Promise<ExamTestCore> {
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
	});
	if (examTest.length === 0) {
		throw new DomainError("No exam test found");
	}
	if (examTest.length > 1) {
		throw new DomainError("Multiple exam tests found");
	}
	return examTest[0].get();
}
