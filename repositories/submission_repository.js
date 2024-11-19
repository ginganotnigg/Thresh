const BaseRepository = require("./base_repository");
const Submission = require("../models/submission");

class SubmissionRepository extends BaseRepository {
  constructor() {
    super(Submission);
  }
}

submissionRepository = new SubmissionRepository();
module.exports = submissionRepository;
