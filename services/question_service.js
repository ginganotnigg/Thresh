const QuestionRepository = require("../repositories/question_repository");
const BaseService = require("./base_service");
const Question = require("../models/question");

class QuestionService extends BaseService {
  constructor() {
    super(QuestionRepository);
  }

  async getQuestionsByTestId(testId) {
    return await this.repository.getQuestionsByTestId(testId);
  }

  async findByQuestionId(questionId) {
    return await this.repository.findByQuestionId(questionId);
  }

  async create(data) {
    const question = await Question.create({
      testVersionID: data.testVersionID,
      content: data.content,
      options: data.options,
      correctAnswer: data.correctAnswer,
      score: data.score,
    });
    return question;
  }

  async update(id, data) {
    const record = await this.repository.findByQuestionId(id);
    if (!record) throw new Error(`${this.model.name} not found`);
    return await record.update(data);
  }

  async delete(id) {
    const record = await this.repository.findByQuestionId(id);
    if (!record) throw new Error(`${this.model.name} not found`);
    return await record.destroy();
  }
}
questionService = new QuestionService();
module.exports = questionService;
