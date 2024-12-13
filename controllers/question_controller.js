const questionService = require('../services/question_service');

// Get all questions for a specific test
const getQuestions = async (req, res, next) => {
  const questions = await questionService.getQuestionsByTestId(req.params.id);
  res.json(questions);
};

// Create a question
const createQuestion = async (req, res, next) => {
  const { testVersionID, content, options, correctAnswer, score } = req.body;

  if (!testVersionID || !content || !options || !correctAnswer || !score) {
    return res.status(400).json({ message: "Test ID, content, options, score and correct answer are required" });
  }

  const newQuestion = await questionService.create({ testVersionID, content, options, correctAnswer, score });
  res.status(201).json({ message: 'Question created', questionId: newQuestion.ID });
};

// Update a question
const updateQuestion = async (req, res, next) => {
  const questionId = req.params.id;
  const updateData = req.body;
  const question = await questionService.findByQuestionId(questionId);

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }
  await questionService.update(questionId, updateData);
  question = await questionService.findByQuestionId(questionId);
  res.json({ message: "Question updated", question });
};

// Delete a question
const deleteQuestion = async (req, res, next) => {
  const questionId = req.params.id;
  const question = await questionService.findByQuestionId(questionId);

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }
  await questionService.delete(id);
  res.json({ message: "Question deleted", question });
};

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
