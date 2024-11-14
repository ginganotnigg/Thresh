import { execute } from '../utilities/database';

export async function getTests(req, res) {
    try {
        const [tests] = await execute(
            `SELECT id, title FROM tests`
        );

        if (tests.length === 0) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function getTestById(req, res) {
    const testId = req.params.id;

    try {
        const [test] = await execute(
            `SELECT id, title FROM tests WHERE id = ?`,
            [testId]
        );

        if (test.length === 0) {
            return res.status(404).json({ message: 'Test not found' });
        }

        const [questions] = await execute(
            `SELECT id, question, options FROM questions WHERE test_id = ?`,
            [testId]
        );

        const randomizedQuestions = questions.map(question => ({
            id: question.id,
            question: question.question,
            options: JSON.parse(question.options), // Parse JSON options
        })).sort(() => 0.5 - Math.random());

        res.json({
            id: test[0].id,
            title: test[0].title,
            questions: randomizedQuestions,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export async function submitTest(req, res) {
    const { testId, answers } = req.body;

    try {
        const [questions] = await execute(
            `SELECT id, correct_answer AS correctAnswer FROM questions WHERE test_id = ?`,
            [testId]
        );

        let score = 0;
        questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswer) score++;
        });

        res.json({ score, totalQuestions: questions.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}