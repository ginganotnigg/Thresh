const BaseRepository = require('./base_repository');
const Test = require('../models/test');
const Question = require('../models/question');

class TestRepository extends BaseRepository {
  constructor() {
    super(Test);
  }

  //custom methods for TestRepository
  async findByTestId(testId) {
    return await Test.findOne({ where: { ID: testId } });
  }

  async getQuestionsByTestId(testId) {
    return await Question.findAll({
      where: { testVersionID: testId },
      attributes: ['ID', 'content', 'options', 'correctAnswer'],
    });
  }
}

testRepository = new TestRepository();
module.exports = testRepository;
