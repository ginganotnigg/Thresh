const BaseService = require('./base_service');
const Test = require('../models/test');
const Attempt = require('../models/attempt');
const TestTag = require('../models/test_tag');
const Test_TestTag = require('../models/test_testtag');
const Question = require('../models/question');
const { Op, Sequelize } = require('sequelize');
const express = require('express');

class TestService extends BaseService {
  constructor() {
    super(Test);
  }

  async findByTestId(testId) {
    const test = await this.model.findByPk(testId);
    const totalScore = await this.getTotalScore(testId);
    return {
      testName: test.title,
      minutesToAnswer: test.minutesToAnswer,
      difficulty: test.difficulty,
      totalPoints: totalScore
    };
  }

  async createTest(testData) {
    const test = await Test.create({
      company: testData.company,
      title: testData.title,
      description: testData.description,
      minutesToAnswer: testData.minutesToAnswer,
      difficulty: testData.difficulty,
      answerCount: 0,
    });
    return test;
  }

  async updateTest(id, data) {
    const record = await this.findByTestId(id);
    if (!record) throw new Error(`${this.model.name} not found`);
    return await record.update(data);
  }

  async deleteTest(id) {
    const record = await this.findByTestId(id);
    if (!record) throw new Error(`${this.model.name} not found`);
    return await record.destroy();
  }

  async addQuestion(testId, questionData) {
    const question = await Question.create({
      testId: testId,
      text: questionData.text,
      options: questionData.options,
      points: questionData.points,
      correctAnswer: questionData.correctAnswer
    });
    return question;
  }

  async updateQuestion(testId, questionId) {
    const question = await Question.findOne({
      where: {
        ID: questionId,
        testId: testId
      }
    });

    if (!question) {
      throw new Error("Question not found");
    }

    const updatedQuestion = await question.update(data);
    return updatedQuestion;
  }

  async deleteQuestion(testId, questionId) {
    const question = await Question.findOne({
      where: {
        ID: questionId,
        testId: testId
      }
    });

    if (!question) {
      throw new Error("Question not found");
    }

    await question.destroy();
    return { message: "Question deleted successfully" };
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
      status = 'Completed';
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

    // Pagination logic
    const perPage = 20;
    const totalTests = filteredTests.length;
    const totalPages = Math.ceil(totalTests / perPage);
    const paginatedTests = filteredTests.slice((page - 1) * perPage, page * perPage);

    return { page: paginatedTests, perPage: perPage, totalPage: totalPages, data: filteredTests };
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

  async getQuestionsWithCandidateChoice(testId, attemptId) {
    const attempt = await Attempt.findByPk(attemptId, {
      attributes: ["choices"],
    });
    if (!attempt) {
      throw new Error("Attempt not found");
    }
    const questions = await Question.findAll({
      where: { testId },
    });

    const questionsWithCandidateChoice = questions.map((question, index) => ({
      question: question.text,
      options: question.options,
      correctAnswer: question.correctAnswer,
      chosenAnswer: attempt.choices[index] !== undefined ? attempt.choices[index] : null,
      score: question.points
    }));

    return questionsWithCandidateChoice;
  }

  async getTestAttempts(testId) {
    const attempts = await Attempt.findAll({
      where: { testId },
      attributes: ["ID", "score", "status", "createdAt"],
    });

    // Pagination logic
    const perPage = 20;
    const totalTests = filteredTests.length;
    const totalPages = Math.ceil(totalTests / perPage);
    const paginatedTests = filteredTests.slice((page - 1) * perPage, page * perPage);

    return { page: paginatedTests, perPage: perPage, totalPage: totalPages, data: attempts };
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

  async getAttemptsByTestId(testId) {
    const attempts = await Attempt.findAll({
      where: { testId },
      attributes: ["score", "candidateId", "createdAt", "status", "choices"],
    });

    const attemptList = attempts.map(attempt => {
      const totalQuestions = attempt.choices.length;
      const perCent = attempt.choices.filter(c => c !== -1).length / totalQuestions * 100;
      return {
        candidateId: attempt.candidateId,
        createAt: attempt.createdAt,
        completeness: perCent,
        score: attempt.score,
      };
    });
    return attemptList;
  }

  async getAttemptDetails(testId, attemptId) {
    const attempt = await Attempt.findByPk(attemptId, {
      where: { testId },
      attributes: ["ID", "score", "status", "choices"],
    });

    if (!attempt) {
      throw new Error("Attempt not found");
    }

    // Pagination logic
    const perPage = 20;
    const totalTests = filteredTests.length;
    const totalPages = Math.ceil(totalTests / perPage);
    const paginatedTests = filteredTests.slice((page - 1) * perPage, page * perPage);

    return { page: paginatedTests, perPage: perPage, totalPage: totalPages, data: attempt };
  }

  async getCandidateAttempts(candidateId) {
    const attempts = await Attempt.findAll({
      where: { candidateId },
      attributes: ["ID", "testId", "score", "status", "createdAt"]
    });

    const testsMap = {};
    for (let attempt of attempts) {
      const testId = attempt.testId;
      if (!testsMap[testId]) {
        const test = await Test.findByPk(testId, {
          attributes: ["ID", "title", "description"]
        });
        if (test) {
          testsMap[testId] = {
            testId: test.ID,
            title: test.title,
            description: test.description,
            attempts: []
          };
        }
      }
      const questionsWithCandidateChoice = await this.getQuestionsWithCandidateChoice(testId, attempt.ID);
      if (testsMap[testId]) {
        testsMap[testId].attempts.push({
          ID: attempt.ID,
          score: attempt.score,
          status: attempt.status,
          answer: questionsWithCandidateChoice,
          createdAt: attempt.createdAt
        });
      }
    }

    const tests = Object.values(testsMap);
    return tests;
  }
}

testService = new TestService();
module.exports = testService;
