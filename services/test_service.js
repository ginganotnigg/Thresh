const TestRepository = require('../repositories/test_repository');
const BaseService = require('./base_service');
const Test = require('../models/test');
const Submission = require('../models/submission');

class TestService extends BaseService {
  constructor() {
    super(TestRepository);
  }

  async findByTestId(testId) {
    return await this.repository.findByTestId(testId);
  }

  async getVersionsByTestId(testId) {
    return await this.repository.getVersionsByTestId(testId);
  }

  async create(testData) {
    const test = await Test.create({
      title: testData.title,
      description: testData.description,
      BMID: testData.BMID,
      isActive: testData.isActive || true,
    });
    return test;
  }

  async update(id, data) {
    const record = await this.repository.findByTestId(id);
    if (!record) throw new Error(`${this.model.name} not found`);
    return await record.update(data);
  }

  async delete(id) {
    const record = await this.repository.findByTestId(id);
    if (!record) throw new Error(`${this.model.name} not found`);
    return await record.destroy();
  }

  async calculateScore(testId, answers) {
    const questions = await this.repository.getQuestionsByTestId(testId);
    let score = 0;

    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) score += question.score;
    });

    return { score, totalQuestions: questions.length };
  }

  async submit(submissionData) {
    const submission = await Submission.create({
      testVersionID: parseInt(submissionData.testId),
      candidateID: submissionData.userID,
      score: submissionData.score,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return submission;
  }
}
testService = new TestService();
module.exports = testService;
