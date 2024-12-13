const testService = require('../services/test_service');
const testVersionService = require('../services/testVersion_service');
const submissionService = require('../services/submission_service');
const User = require('../models/user');

// List all tests
const getTests = async (req, res, next) => {
  const result = await testService.getAll();
  res.json(result);
};

// Get test by ID
const getTestById = async (req, res, next) => {
  const test = await testService.findByTestId(req.params.id);
  if (!test) return res.status(404).json({ message: 'Test not found' });
  res.json(test);
};

// Create a test
const createTest = async (req, res, next) => {
  const { title, description, BMID, isActive } = req.body;

  if (!title || !BMID) {
    return res.status(400).json({ message: "Title and BMID are required" });
  }
  const test = await testService.create({ title, description, BMID, isActive });
  res.status(201).json({ message: "Test created", testId: test.ID });
};

// Update a test
const updateTest = async (req, res, next) => {
  const testId = req.params.id;
  const updateData = req.body;
  const test = await testService.findByTestId(testId);

  if (!test) {
    return res.status(404).json({ message: "Test not found" });
  }
  const newVersion = await testVersionService.getLatestVersion(testId);
  await testVersionService.create({ 
    testId, 
    versionNumber: newVersion.versionNumber + 1, 
    userId: updateData.BMID });
  const newTest = await testService.update(testId, updateData);
  await testService.create(newTest);
  res.json({ message: "Test updated", newTest });
};

// Delete a test
const deleteTest = async (req, res, next) => {
  const testId = req.params.id;
  const test = await testService.findByTestId(testId);

  if (!test) {
    return res.status(404).json({ message: "Test not found" });
  }
  await testService.delete(id);
  res.json({ message: "Test updated", test });
};

// Get test versions
const getTestVersions = async (req, res, next) => {
  const testID = req.params.id;

  const testWithVersions = await testVersionService.getVersionsByTestId(testID);

  if (!testWithVersions) {
    return res.status(404).json({ message: "Test not found" });
  }

  res.json(testWithVersions);
}

const getTestAttempts = async (req, res, next) => {
  const testVersionID = req.params.id;

  const submissions = await submissionService.findByTestVersionID(testVersionID);

  const attempts = submissions.map(submission => ({
    id: submission.ID,
    grade: submission.score,
    status: submission.score !== null ? "Finished" : "In Progress",
    submittedAt: submission.createdAt ? submission.createdAt.toISOString() : null,
  }));

  // Return the response
  res.json({ attempts });
};

// Submit test answers
const submitTest = async (req, res, next) => {
  const testId = req.params.id;
  const { userID, answers } = req.body;
  const { score, totalQuestions } = await testService.calculateScore(testId, answers);

  const submission = await testService.submit({ testId, userID, score });
  res.status(201).json({
    message: "Test submitted successfully",
    submission: {
      testVersionID: submission.testVersionID,
      userID: submission.candidateID,
      score: submission.score,
      totalQuestions: totalQuestions,
    },
  });
};

module.exports = {
  getTests,
  getTestById,
  createTest,
  updateTest,
  deleteTest,
  getTestVersions,
  getTestAttempts,
  submitTest,
};
