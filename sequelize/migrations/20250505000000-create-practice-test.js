'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('PracticeTests', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			testId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'Tests',
					key: 'id'
				},
				allowNull: false,
				unique: true, // This ensures a Test can have at most one PracticeTest
				onDelete: 'CASCADE'
			},
			difficulty: {
				type: Sequelize.STRING,
				allowNull: false
			},
			tags: {
				type: Sequelize.ARRAY(Sequelize.STRING),
				allowNull: false
			},
			numberOfQuestions: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			numberOfOptions: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			outlines: {
				type: Sequelize.ARRAY(Sequelize.STRING),
				allowNull: false
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
			}
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('PracticeTests');
	}
};