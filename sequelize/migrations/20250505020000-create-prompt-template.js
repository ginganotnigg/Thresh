'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('PromptTemplates', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				allowNull: false,
				primaryKey: true
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			title: {
				type: Sequelize.STRING,
				allowNull: false
			},
			description: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			difficulty: {
				type: Sequelize.STRING,
				allowNull: false
			},
			tags: {
				type: Sequelize.ARRAY(Sequelize.STRING),
				allowNull: false,
				defaultValue: []
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
				type: Sequelize.ARRAY(Sequelize.TEXT),
				allowNull: false,
				defaultValue: []
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('PromptTemplates');
	}
};