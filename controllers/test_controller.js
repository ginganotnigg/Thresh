const testService = require('../services/test_service');

// Get paginated list of tests
const getTests = async (req, res) => {
  const tests = await testService.getAll();
  res.json(tests);
};

// Get suggested tags
const getSuggestedTags = async (req, res) => {
  const suggestedTags = await testService.getSuggestedTags();
  res.json(suggestedTags);
};

const getTestById = async (req, res) => {
  const { testId } = req.params;
  const test = await testService.findByTestId(testId);
  res.json(test);
}

// Get filtered list of tests
const getFilteredTests = async (req, res) => {
  const { minMinute, maxMinute, difficulty, tags, searchName } = req.query;
  const filteredTests = await testService.getFilteredTests({
    minMinute,
    maxMinute,
    difficulty,
    tags,
    searchName,
  });
  res.json(filteredTests);
};

// Get test attempts (page or data)
const getTestAttempts = async (req, res) => {
  const testId = req.params.testId;
  const attempts = await testService.getTestAttempts(testId);
  res.json(attempts);
};

const getTestDetails = async (req, res) => {
  const { testId } = req.params;
  const test = await testService.getTestDetails(testId);
  res.json(test);
}

// Get attempt page
const getAttemptPage = async (req, res) => {
  const { testId, attemptId } = req.params;
  const attemptPage = await testService.getAttemptPage(testId, attemptId);
  res.json(attemptPage);
}

// Get paginated attempt details
const getAttemptDetails = async (req, res) => {
  const { testId, attemptId } = req.params;
  const { page = 1, perPage = 20 } = req.query; // Default values if not provided

  const attemptDetails = await testService.getAttemptDetails(testId, attemptId, parseInt(page), parseInt(perPage));
  res.json(attemptDetails);
};

// Get TestDo page data
const getQuestions = async (req, res) => {
  const { testId } = req.params;
  const testPage = await testService.getQuestions(testId);
  res.json(testPage);
};

// Submit test answers
const submitTest = async (req, res) => {
  const { testId } = req.params;
  const { answers } = req.body;

  const result = await testService.submit({ testId, answers });
  res.json({
    message: "Test submitted successfully",
    result,
  });
};

// Create a new test
const createTest = async (req, res) => {
  const testData = req.body;
  if (testData.length < 4) return res.status(400).json({ message: "Missing fields" });

  const test = await testService.createTest(testData);
  res.status(201).json({ message: "Test created", testId: test.ID });
};

// Update an existing test
const updateTest = async (req, res) => {
  const { testId } = req.params;
  const updateData = req.body;

  const updatedTest = await testService.updateTest(testId, updateData);
  res.json({ message: "Test updated successfully", updatedTest });
};

// Delete a test
const deleteTest = async (req, res) => {
  const { testId } = req.params;
  await testService.deleteTest(testId);
  res.json({ message: "Test deleted successfully" });
};

const createQuestion = async (req, res) => {
  const { testId } = req.params;
  const { questions } = req.body;

  const newQuestion = await testService.addMultipleQuestions(testId, questions);
  res.status(201).json({ message: "Question created", question: newQuestion });
}

const updateQuestion = async (req, res) => {
  const { testId } = req.params;
  const { questions } = req.body;

  const updatedQuestion = await testService.updateMultipleQuestions(testId, questions);
  res.json({ message: "Question updated successfully", updatedQuestion });
}

const deleteQuestion = async (req, res) => {
  const { testId, questionId } = req.params;

  await testService.deleteQuestion(testId, questionId);
  res.json({ message: "Question deleted successfully" });
}

const getAllAttempts = async (req, res) => {
  const { testId } = req.params;
  const attempts = await testService.getAttemptsByTestId(testId);
  res.json(attempts);
}

const getCandidateAttempts = async (req, res) => {
  const { candidateId, attemptId } = req.params;
  const attempts = await testService.getCandidateAttemptDetails(candidateId, attemptId);
  res.json(attempts);
}

module.exports = {
  getTests,
  getSuggestedTags,
  getTestDetails,
  getFilteredTests,
  getTestAttempts,
  getAttemptPage,
  getAttemptDetails,
  getQuestions,
  submitTest,
  createTest,
  updateTest,
  deleteTest,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getTestById,
  getAllAttempts,
  getCandidateAttempts,
};
