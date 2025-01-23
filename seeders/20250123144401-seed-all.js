'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    if (process.env.SEED_DATA === 'false') {
      return;
    }

    await queryInterface.bulkInsert('TestTag', [
      {
        name: 'tag1'
      },
      {
        name: 'tag2'
      }], {});

    await queryInterface.bulkInsert('Test', [
      {
        name: 'test1',
        TestTagID: 1
      },
      {
        name: 'test2',
        TestTagID: 2
      }], {});

    await queryInterface.bulkInsert('TestVersion', [
      {
        testID: 1,
        versionNumber: '1.0.0'
      },
      {
        testID: 2,
        versionNumber: '1.0.0'
      }], {});

    await queryInterface.bulkInsert('Test_TestTag', [
      {
        testId: 1,
        tagId: 1
      },
      {
        testId: 2,
        tagId: 2
      }], {});

    await queryInterface.bulkInsert('Attempt', [
      {
        testId: 1,
        candidateId: 1,
        score: 100,
        status: 'completed',
        choices: JSON.stringify({ "1": 1, "2": 2, "3": 3 })
      },
      {
        testId: 2,
        candidateId: 2,
        score: 100,
        status: 'completed',
        choices: JSON.stringify({ "1": 1, "2": 2, "3": 3 })
      }], {});

    await queryInterface.bulkInsert('Question', [
      {
        testId: 1,
        text: 'question1',
        options: JSON.stringify({ "1": "option1", "2": "option2", "3": "option3" }),
        points: 10,
        correctAnswer: 1
      },
      {
        testId: 2,
        text: 'question2',
        options: JSON.stringify({ "1": "option1", "2": "option2", "3": "option3" }),
        points: 10,
        correctAnswer: 1
      }], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('TestTag', null, {});
    await queryInterface.bulkDelete('Test', null, {});
    await queryInterface.bulkDelete('TestVersion', null, {});
    await queryInterface.bulkDelete('Test_TestTag', null, {});
    await queryInterface.bulkDelete('Attempt', null, {});
    await queryInterface.bulkDelete('Question', null, {});

  }
};

//seed data
// npx sequelize-cli db:seed:all


//reset db and seed data
// npx sequelize-cli db:migrate:undo:all
// npx sequelize-cli db:migrate
// npx sequelize-cli db:seed:all

