import { DataDriven } from "../../../../../common/test/data-driven.i"
import { QuestionResult } from "../../../schemas/result"

const questionData: DataDriven<number, { length: number }>[] = [
	{
		input: 1,
		expected: { length: 10 }
	},
	{
		input: 0,
		expected: { length: 0 }
	}
]

export default questionData;