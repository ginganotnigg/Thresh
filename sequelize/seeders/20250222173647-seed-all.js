'use strict';
const data = require('./data.d.ts');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert('Tags', data.default.tags, {});
		await queryInterface.bulkInsert('Tests', data.default.tests, {});
		await queryInterface.bulkInsert('Tests_has_Tags', data.default.testsHasTags, {});
		await queryInterface.bulkInsert('Questions', data.default.questions, {});
		await queryInterface.bulkInsert('Attempts', data.default.attempts, {});
		await queryInterface.bulkInsert('Attempts_answer_Questions', data.default.attemptsAnswerQuestions, {});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete('Attempts_answer_Questions', null, {});
		await queryInterface.bulkDelete('Attempts', null, {});
		await queryInterface.bulkDelete('Questions', null, {});
		await queryInterface.bulkDelete('Tests_has_Tags', null, {});
		await queryInterface.bulkDelete('Tests', null, {});
		await queryInterface.bulkDelete('Tags', null, {});
	}
};
