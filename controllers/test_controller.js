const testService = require('../services/test_service');
const submissionService = require('../services/submission_service');

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
  const attemptDetails = await testService.getAttemptDetails(testId, attemptId);
  res.json(attemptDetails);
};

// Get test answers (data)
const getTestAnswers = async (req, res) => {
  const { testId, attemptId } = req.params;
  const testAnswers = await submissionService.getTestAnswers(testId, attemptId);
  res.json(testAnswers);
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
  const { choices } = req.body;

  const result = await testService.submit({ testId, choices });
  res.json({
    message: "Test submitted successfully",
    result,
  });
};

// Create a new test
const createTest = async (req, res) => {
  const { title, description, BMID, isActive } = req.body;
  if (!title || !BMID) return res.status(400).json({ message: "Title and BMID are required" });

  const test = await testService.create({ title, description, BMID, isActive });
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

// Get versions of a test
const getTestVersions = async (req, res) => {
  const { testId } = req.params;
  const versions = await testService.getTestVersions(testId);
  res.json(versions);
};

module.exports = {
  getTests,
  getSuggestedTags,
  getTestDetails,
  getFilteredTests,
  getTestAttempts,
  getAttemptPage,
  getAttemptDetails,
  getTestAnswers,
  getQuestions,
  submitTest,
  createTest,
  updateTest,
  deleteTest,
  getTestVersions,
};
