const BaseRepository = require("./base_repository");
const Question = require("../models/question");

class QuestionRepository extends BaseRepository {
  constructor() {
    super(Question);
  }

  async getQuestionsByTestId(testId) {
    return await Question.findAll({
      where: { testVersionID: testId },
      attributes: ['ID', 'content', 'options', 'correctAnswer', 'score'],
    });
  }

  async findByQuestionId(questionId) {
    return await Question.findOne({ where: { ID: questionId } });
  }
}

questionRepository = new QuestionRepository();
module.exports = questionRepository;
