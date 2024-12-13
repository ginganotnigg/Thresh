const TestVersionRepository = require("../repositories/testVersion_repository");
const BaseService = require("./base_service");

class TestVersionService extends BaseService {
  constructor() {
    super(TestVersionRepository);
  }

  async getVersionsByTestId(testId) {
    return await this.repository.getVersionsByTestId(testId);
  }

  async getTestID(testId) {
    return await this.repository.getTestID(testId);
  }

  async getLatestVersion(testId) {
    return await this.repository.getLatestVersion(testId);
  }

  async create(data) {
    return await this.repository.create(data);
  }
}
testVersionService = new TestVersionService();
module.exports = testVersionService;
