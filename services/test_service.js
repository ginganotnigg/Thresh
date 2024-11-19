const TestRepository = require("../repositories/test_repository");
const BaseService = require("./base_service");

class TestService extends BaseService {
  constructor() {
    super(TestRepository);
  }

  async findByTitle(title) {
    return await this.repository.findByTitle(title);
  }
}
testService = new TestService();
module.exports = testService;
