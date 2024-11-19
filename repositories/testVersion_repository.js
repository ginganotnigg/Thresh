const BaseRepository = require("./base_repository");
const TestVersion = require("../models/test_version");

class TestVersionRepository extends BaseRepository {
  constructor() {
    super(TestVersion);
  }
}

testVersionRepository = new TestVersionRepository();
module.exports = testVersionRepository;
