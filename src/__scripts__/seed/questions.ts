// Mock question data for seeding the database
// These questions correspond to the two tests we created:
// 1. JavaScript Fundamentals (e57f29b5-3b6d-4d4e-82c9-f155a7e02a6c)
// 2. React Component Architecture (b82c91d3-ae2f-4e0f-a105-3ba124fb9a42)

const questions = [
	// Questions for JavaScript Fundamentals test
	{
		id: 1,
		testId: 'e57f29b5-3b6d-4d4e-82c9-f155a7e02a6c',
		text: 'Which of the following is not a JavaScript data type?',
		options: JSON.stringify(['String', 'Boolean', 'Float', 'Symbol']),
		points: 10,
		correctOption: 2 // Float is not a primitive JS data type
	},
	{
		id: 2,
		testId: 'e57f29b5-3b6d-4d4e-82c9-f155a7e02a6c',
		text: 'What will console.log(typeof []) output?',
		options: JSON.stringify(['array', 'object', 'undefined', 'Array']),
		points: 15,
		correctOption: 1 // In JavaScript, arrays are objects
	},
	{
		id: 3,
		testId: 'e57f29b5-3b6d-4d4e-82c9-f155a7e02a6c',
		text: 'Which method is used to add an element to the end of an array?',
		options: JSON.stringify(['push()', 'append()', 'add()', 'concat()']),
		points: 10,
		correctOption: 0 // push() adds to the end of an array
	},

	// Questions for React Component Architecture test
	{
		id: 4,
		testId: 'b82c91d3-ae2f-4e0f-a105-3ba124fb9a42',
		text: 'Which hook is used to perform side effects in a function component?',
		options: JSON.stringify(['useState', 'useEffect', 'useContext', 'useReducer']),
		points: 10,
		correctOption: 1 // useEffect is for side effects
	},
	{
		id: 5,
		testId: 'b82c91d3-ae2f-4e0f-a105-3ba124fb9a42',
		text: 'What is the correct way to conditionally render a component in React?',
		options: JSON.stringify([
			'if(condition) { return <Component /> }',
			'condition && <Component />',
			'<Component if={condition} />',
			'All of the above'
		]),
		points: 15,
		correctOption: 1 // condition && <Component /> is commonly used
	},
	{
		id: 6,
		testId: 'b82c91d3-ae2f-4e0f-a105-3ba124fb9a42',
		text: 'Which of the following is NOT a way to optimize React performance?',
		options: JSON.stringify([
			'Using React.memo for functional components',
			'Implementing shouldComponentUpdate in class components',
			'Using keys in lists',
			'Using inline functions in render methods'
		]),
		points: 20,
		correctOption: 3 // Inline functions in render methods can hurt performance
	}
];

export default questions;