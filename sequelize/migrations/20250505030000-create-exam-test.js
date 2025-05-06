'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('ExamTests', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			testId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				unique: true,
				references: {
					model: 'Tests',
					key: 'id'
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			},
			roomId: {
				type: Sequelize.STRING,
				allowNull: false
			},
			password: {
				type: Sequelize.STRING,
				allowNull: true
			},
			numberOfAttemptsAllowed: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 1
			},
			isAnswerVisible: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			isAllowedToSeeOtherResults: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false
			},
			openDate: {
				type: Sequelize.DATE,
				allowNull: false
			},
			closeDate: {
				type: Sequelize.DATE,
				allowNull: false
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
		await queryInterface.dropTable('ExamTests');
	}
};