const BaseRepository = require("./base_repository");
const Test = require("../models/test");

class TestRepository extends BaseRepository {
  constructor() {
    super(Test);
  }

  //custom methods for TestRepository
  async findByTitle(title) {
    return await Test.findOne({ where: { title } });
  }
}

testRepository = new TestRepository();
module.exports = testRepository;
