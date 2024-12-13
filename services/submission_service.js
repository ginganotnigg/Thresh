const SubmissionRepository = require('../repositories/submission_repository');
const BaseService = require('./base_service');

class SubmissionService extends BaseService {
  constructor() {
    super(SubmissionRepository);
  }

  async findByTestVersionID(testVersionID) {
    return await this.repository.findByTestVersionID(testVersionID);
  }
}
submissionService = new SubmissionService();
module.exports = submissionService;
