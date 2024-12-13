const submissionService = require("../services/submission_service");

const listSubmissions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, filter = {} } = req.query; // Pagination and filter
    const submissions = await submissionService.getAll({ page, limit, filter });
    res.json(submissions);
  } catch (error) {
    next(error);
  }
};

const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await submissionService.getById(req.params.id);
    if (!submission) return res.status(404).json({ message: "Submission not found" });
    res.json(submission);
  } catch (error) {
    next(error);
  }
};

const listTestVersions = async (req, res, next) => {
  try {
    const testVersions = await submissionService.getTestVersions(req.query.testId);
    res.json(testVersions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listSubmissions,
  getSubmissionById,
  listTestVersions,
};