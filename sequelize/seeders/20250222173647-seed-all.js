'use strict';
const data = require('./data.d.ts');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert('Tag', data.default.tags, {});
		await queryInterface.bulkInsert('Test', data.default.tests, {});
		await queryInterface.bulkInsert('Tests_has_Tags', data.default.testsTags, {});
		await queryInterface.bulkInsert('Question', data.default.questions, {});
		await queryInterface.bulkInsert('Attempt', data.default.attempts, {});
		await queryInterface.bulkInsert('Attempts_answer_Questions', data.default.attemptsAnswerQuestions, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Attempts_answer_Questions', null, {});
		await queryInterface.bulkDelete('Attempt', null, {});
		await queryInterface.bulkDelete('Question', null, {});
		await queryInterface.bulkDelete('Tests_has_Tags', null, {});
		await queryInterface.bulkDelete('Test', null, {});
		await queryInterface.bulkDelete('Tag', null, {});
	}
};
