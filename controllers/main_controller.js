const pool = require('../utilities/database');

const getTests = async (req, res) => {
    try {
        const [tests] = await pool.execute(
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

const getTestById = async (req, res) => {
    const testId = req.params.id;


    try {
        const [test] = await pool.execute(
            `SELECT id, title FROM tests WHERE id = ?`,
            [testId]
        );

        if (test.length === 0) {
            return res.status(404).json({ message: 'Test not found' });
        }

        const [questions] = await pool.execute(
            `SELECT id, question, options FROM questions WHERE test_id = ?`,
            [testId]
        );

        const [vers] = await pool.execute(
            `SELECT version FROM tests WHERE id = ?`,
            [testId]
        );

        const version = vers[0].version;

        res.json({
            id: test[0].id,
            title: test[0].title,
            questions: questions,
            version: version
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const submitTest = async (req, res) => {
    const { testId, answers } = req.body;

    try {
        const [questions] = await pool.execute(
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

const getTestVersions = async (req, res) => {
    const testId = req.params.id;

    try {
        if (!testId) {
            return res.status(404).json({ message: 'Test ID is required' });
        }

        const [test] = await pool.execute(
            `SELECT title FROM tests WHERE id = ?`,
            [testId]
        );

        if (test.length === 0) {
            return res.status(404).json({ message: 'Test not found' });
        }

        const testTitle = test[0].title;
        

        const [tests] = await pool.execute(
            `SELECT id, title, version, modified_at FROM tests WHERE title = ?`,
            [testTitle]
        );

        res.json(tests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTests,
    getTestById,
    submitTest,
    getTestVersions
};