const pool = require('../utilities/database');

// Create a new test
const createTest = async (req, res) => {
    const { title, description, version } = req.body;

    try {
        const [result] = await pool.execute(
            `INSERT INTO tests (title, description, version, created_at, modified_at) VALUES (?, ?, ?, NOW(), NOW())`,
            [title, description, version]
        );

        res.status(201).json({ message: 'Test created', testId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a test
const deleteTest = async (req, res) => {
    const testId = req.params.id;

    try {
        const [result] = await pool.execute(`DELETE FROM tests WHERE id = ?`, [testId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.json({ message: 'Test deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a test
const updateTest = async (req, res) => {
    const testId = req.params.id;
    const { title, description } = req.body;

    try {
        const [result] = await pool.execute(
            `UPDATE tests SET title = ?, description = ?, modified_at = NOW() WHERE id = ?`,
            [title, description, testId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.json({ message: 'Test updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get detailed test information
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

// Get test versions
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

// List all tests
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

// Submit test answers
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

// List questions of a test
const getQuestions = async (req, res) => {
    const testId = req.params.id;

    try {
        const [questions] = await pool.execute(
            `SELECT id, question, options FROM questions WHERE test_id = ?`,
            [testId]
        );

        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a question
const createQuestion = async (req, res) => {
    const { testId, question, options, correctAnswer } = req.body;

    try {
        await pool.execute(
            `INSERT INTO questions (test_id, question, options, correct_answer) VALUES (?, ?, ?, ?)`,
            [testId, question, options, correctAnswer]
        );

        res.status(201).json({ message: 'Question created' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a question
const updateQuestion = async (req, res) => {
    const questionId = req.params.id;
    const { question, options, correctAnswer } = req.body;

    try {
        const [result] = await pool.execute(
            `UPDATE questions SET question = ?, options = ?, correct_answer = ? WHERE id = ?`,
            [question, options, correctAnswer, questionId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({ message: 'Question updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a question
const deleteQuestion = async (req, res) => {
    const questionId = req.params.id;

    try {
        const [result] = await pool.execute(`DELETE FROM questions WHERE id = ?`, [questionId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.json({ message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTest,
    deleteTest,
    updateTest,
    getTestById,
    getTestVersions,
    getTests,
    submitTest,
    getQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
};