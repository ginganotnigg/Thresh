import { DataDriven } from "../../../../../library/caymejs/test/data-driven.i"
import { QuestionResponse } from "../../../schemas/response"

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