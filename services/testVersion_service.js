const TestVersionRepository = require("../repositories/testVersion_repository");
const BaseService = require("./base_service");

class TestVersionService extends BaseService {
  constructor() {
    super(TestRepository);
  }
}
testVersionService = new TestVersionService();
module.exports = testVersionService;
