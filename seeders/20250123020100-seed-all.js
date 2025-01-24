require('dotenv').config();

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    if (process.env.SEED_DATA === 'false') {
      return;
    }

    // Seed TestTags
    await queryInterface.bulkInsert('TestTags', [
      { name: 'JavaScript' },
      { name: 'Node.js' },
      { name: 'React' },
      { name: 'SQL' },
    ], {});

    // Seed Tests
    await queryInterface.bulkInsert('Tests', [
      {
        companyId: 1,
        title: 'JavaScript Basics',
        description: 'A test to assess fundamental JavaScript skills.',
        minutesToAnswer: 15,
        difficulty: 'easy',
        answerCount: 4,
      },
      {
        companyId: 2,
        title: 'Advanced Node.js',
        description: 'Evaluate in-depth knowledge of Node.js.',
        minutesToAnswer: 20,
        difficulty: 'hard',
        answerCount: 5,
      },
    ], {});

    // Seed Test_TestTags (Relationship between Tests and Tags)
    await queryInterface.bulkInsert('Test_TestTags', [
      { testId: 1, tagId: 1 }, // JavaScript Basics -> JavaScript
      { testId: 2, tagId: 2 }, // Advanced Node.js -> Node.js
    ], {});

    // Seed Attempts
    await queryInterface.bulkInsert('Attempts', [
      {
        testId: 1,
        candidateId: 101,
        score: 85,
        status: 'completed',
        choices: JSON.stringify({ "1": "A", "2": "B", "3": "C" }),
      },
      {
        testId: 2,
        candidateId: 102,
        score: 92,
        status: 'completed',
        choices: JSON.stringify({ "1": "B", "2": "D", "3": "A" }),
      },
    ], {});

    // Seed Questions
    await queryInterface.bulkInsert('Questions', [
      {
        testId: 1,
        text: 'What does `let` do in JavaScript?',
        options: JSON.stringify({
          "1": "Declare a block-scoped variable",
          "2": "Declare a function",
          "3": "Declare a global variable",
        }),
        points: 5,
        correctAnswer: 1,
      },
      {
        testId: 2,
        text: 'Which module handles HTTP requests in Node.js?',
        options: JSON.stringify({
          "1": "fs",
          "2": "http",
          "3": "path",
        }),
        points: 5,
        correctAnswer: 2,
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('TestTags', null, {});
    await queryInterface.bulkDelete('Tests', null, {});
    await queryInterface.bulkDelete('Test_TestTags', null, {});
    await queryInterface.bulkDelete('Attempts', null, {});
    await queryInterface.bulkDelete('Questions', null, {});
  },
};


//seed data
// npx sequelize-cli db:seed:all


//reset db and seed data
// npx sequelize-cli db:migrate:undo:all
// npx sequelize-cli db:migrate
// npx sequelize-cli db:seed:all

