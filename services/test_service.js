const TestRepository = require('../repositories/test_repository');
const BaseService = require('./base_service');
const Test = require('../models/test');
const Attempt = require('../models/attempt');
const TestTag = require('../models/test_tag');
const Test_TestTag = require('../models/test_testtag');
const Question = require('../models/question');
const { Op, Sequelize } = require('sequelize');
const e = require('express');

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

  async submit(attemptData) {
    const questions = await Question.findAll({
      where: { testId: attemptData.testId },
    });

    if (questions.length !== attemptData.choices.length) {
      throw new Error("Invalid number of choices");
    }

    let score = 0;
    let status = 'Incomplete';

    if (!attemptData.choices.includes(-1)) {
      status = 'Complete';
      questions.forEach((question, index) => {
        if (attemptData.choices[index] === question.correctAnswer) {
          score += question.points;
        }
      });
    }

    const attempt = await Attempt.create({
      testId: parseInt(attemptData.testId),
      candidateId: 201,
      choices: attemptData.choices,
      score: score,
      status: status,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await Test.increment('answerCount', { where: { ID: attemptData.testId } });

    return attempt;
  }

  async getTagNames(testId) {
    const testTags = await Test_TestTag.findAll({
      where: { testId },
      attributes: ['tagId']
    });

    const tagIds = testTags.map(testTag => testTag.tagId);

    const tags = await TestTag.findAll({
      where: { ID: { [Op.in]: tagIds } },
      attributes: ['name']
    });

    return tags.map(tag => tag.name);
  }

  async getTestDetails(testId) {
    const test = await Test.findByPk(testId);
    if (!test) throw new Error("Test not found");

    const tagNames = await this.getTagNames(testId);

    const highestScore = await Attempt.max("score", {
      where: { testId: testId },
    });
    return {
      id: test.ID,
      companyId: test.company, // Assuming companyId maps to 'company'
      title: test.title,
      description: test.description,
      minutesToAnswer: test.minutesToAnswer,
      tags: tagNames, // Extract tag names
      answerCount: test.answerCount,
      highestScore: highestScore || 0, // Default to 0 if no attempts
      createdAt: test.createdAt,
    };
  }

  async getFilteredTests({ minMinute, maxMinute, difficulty, tags, searchName }) {
    const query = {
      where: {
        minutesToAnswer: {
          [Op.gte]: minMinute || 0,
          [Op.lte]: maxMinute || Number.MAX_VALUE,
        },
        difficulty: difficulty ? { [Op.eq]: difficulty } : { [Op.ne]: null },
        title: searchName ? { [Op.like]: `%${searchName}%` } : { [Op.ne]: null },
      },
      include: [],
    };

    const tests = await Test.findAll(query);
    const filteredTests = [];
    if (tags && tags.length > 0) {
      for (const test of tests) {
        const tagNames = await this.getTagNames(test.ID);
        if (tags.some(tag => tagNames.includes(tag))) {
          test.dataValues.tags = tagNames;
          filteredTests.push(test);
        }
      }
    }
    else {
      filteredTests = tests;
    }

    return { page: 1, perPage: 20, totalPage: 1, data: filteredTests };
  };

  async getSuggestedTags() {
    const tags = await TestTag.findAll({
      attributes: ['name'],
      order: Sequelize.literal('RAND()'), // Random order
      limit: 5,
    });

    return { suggestedTags: tags.map((tag) => tag.name) };
  };

  async getQuestions(testId) {
    const test = await Test.findByPk(testId);
    if (!test) {
      throw new Error("Test not found");
    }

    const questions = await Question.findAll({
      where: { testId },
    });

    return {
      testId: test.ID,
      title: test.title,
      questions: questions,
    };
  };

  async getTestAttempts(testId) {
    const attempts = await Attempt.findAll({
      where: { testId },
      attributes: ["ID", "score", "status", "createdAt"],
    });

    return {
      page: 1,
      perPage: 20,
      totalPage: 1,
      data: attempts,
    };
  };

  async getTotalScore(testId) {
    const totalScore = await Question.sum('points', {
      where: { testId }
    });
    return totalScore;
  }

  async getTotalQuestions(testId) {
    return await Question.count({
      where: { testId }
    });
  }

  async getAttemptPage(testId, attemptId) {
    const test = await Test.findByPk(testId, {
      attributes: ["ID", "company", "title"]
    });
    if (!test) {
      throw new Error("Test not found");
    }

    const tagNames = await this.getTagNames(testId);

    const totalScore = await this.getTotalScore(testId);

    const totalQuestions = await this.getTotalQuestions(testId);

    const attempt = await Attempt.findByPk(attemptId, {
      where: { testId },
      attributes: ["ID", "score", "status", "choices"],
    });
    if (!attempt) {
      throw new Error("Attempt not found");
    }

    return {
      id: attempt.ID,
      company: test.company,
      title: test.title,
      tags: tagNames,
      score: attempt.score,
      totalScore: totalScore,
      totalQuestions: totalQuestions,
    };
  }

  async getAttemptDetails(testId, attemptId) {
    const attempt = await Attempt.findByPk(attemptId, {
      where: { testId },
      attributes: ["ID", "score", "status", "choices"],
    });

    if (!attempt) {
      throw new Error("Attempt not found");
    }

    return {
      page: 1,
      perPage: 20,
      totalPage: 1,
      data: attempt,
    };
  }
}
testService = new TestService();
module.exports = testService;
