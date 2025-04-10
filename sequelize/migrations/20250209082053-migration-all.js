'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('Tags', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
			}
		});

		await queryInterface.createTable('Tests', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			managerId: {
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
			minutesToAnswer: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			difficulty: {
				type: Sequelize.STRING,
				allowNull: false
			},
			createdAt: {
				type: Sequelize.DATE,
				defaultValue: new Date()
			},
			updatedAt: {
				type: Sequelize.DATE,
				defaultValue: new Date()
			}
		});

		await queryInterface.createTable('Questions', {
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
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			},
			text: {
				type: Sequelize.TEXT,
				allowNull: false
			},
			options: {
				type: Sequelize.JSON,
				allowNull: false
			},
			points: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			correctAnswer: {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		});

		await queryInterface.createTable('Attempts', {
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
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
				allowNull: false
			},
			candidateId: {
				type: Sequelize.STRING,
				allowNull: false
			},
			status: {
				type: Sequelize.STRING,
				allowNull: false
			},
			createdAt: {
				type: Sequelize.DATE,
				defaultValue: new Date()
			},
			updatedAt: {
				type: Sequelize.DATE,
				defaultValue: new Date()
			}
		});

		await queryInterface.createTable('Tests_has_Tags', {
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
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			},
			tagId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'Tags',
					key: 'id'
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			}
		});

		await queryInterface.createTable('Attempts_answer_Questions', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			attemptId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'Attempts',
					key: 'id'
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			},
			questionId: {
				type: Sequelize.INTEGER,
				references: {
					model: 'Questions',
					key: 'id'
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE'
			},
			chosenOption: {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		});
	},

	async down(queryInterface, Sequelize) {
		// Drop all tables
		await queryInterface.dropTable('Tests_has_Tags');
		await queryInterface.dropTable('Attempts_answer_Questions');
		await queryInterface.dropTable('Attempts');
		await queryInterface.dropTable('Questions');
		await queryInterface.dropTable('Tests');
		await queryInterface.dropTable('Tags');
	}
};