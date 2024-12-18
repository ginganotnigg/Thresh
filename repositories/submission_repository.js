const BaseRepository = require('./base_repository');
const Submission = require('../models/attempt');

class SubmissionRepository extends BaseRepository {
  constructor() {
    super(Submission);
  }

  async findByTestVersionID(testVersionID) {
    return await Submission.findAll({
      where: {
        testVersionID
      },
      attributes: ['ID', 'score', 'createdAt'],
    });
  }
}

submissionRepository = new SubmissionRepository();
module.exports = submissionRepository;
