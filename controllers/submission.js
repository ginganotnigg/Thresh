const submissionService = require("../services/submission_service");

async function getAllSubmission(req, res) {
  return res.json(await submissionService.getAll());
}

module.exports = { getAllSubmission };
