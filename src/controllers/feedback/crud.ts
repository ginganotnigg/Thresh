import { Op, Transaction } from "sequelize";
import sequelize from "../../configs/orm/sequelize/sequelize";
import Feedback from "../../infrastructure/models/feedback";
import Test from "../../infrastructure/models/test";
import { DomainError } from "../../shared/errors/domain.error";
import { Paged, sortBy } from "../../shared/controller/schemas/base";
import {
	FeedbackCore,
	GetFeedbacksQuery,
	PostFeedbackBody,
	PutFeedbackBody,
	GetFeedbacksResponse
} from "./resouce.schema";

export class FeedbackCrudService {
	/**
	 * Get a list of feedbacks with pagination, sorting, and filtering
	 */
	static async getFeedbacks(query: GetFeedbacksQuery): Promise<GetFeedbacksResponse> {
		const {
			testId,
			sortByCreatedAt,
			sortByRating,
			filterByProblems,
		} = query;

		// Build order array
		const order: any[] = [];
		if (sortByCreatedAt) {
			const { field, order: sortOrder } = sortBy(sortByCreatedAt);
			if (field === 'createdAt') {
				order.push(['createdAt', sortOrder === 'asc' ? 'ASC' : 'DESC']);
			}
		}
		if (sortByRating) {
			const { field, order: sortOrder } = sortBy(sortByRating);
			if (field === 'rating') {
				order.push(['rating', sortOrder === 'asc' ? 'ASC' : 'DESC']);
			}
		}

		// Default sort by createdAt DESC if no sort specified
		if (order.length === 0) {
			order.push(['createdAt', 'DESC']);
		}

		// Build where conditions
		const whereConditions: any = {
			testId,
		};

		// Filter by problems if specified
		if (filterByProblems && filterByProblems.length > 0) {
			whereConditions.problems = {
				[Op.overlap]: filterByProblems,
			};
		}

		try {
			const { count, rows } = await Feedback.findAndCountAll({
				where: whereConditions,
				order,
				include: [
					{
						model: Test,
						attributes: ['id', 'title'],
					}
				],
			});

			const data: FeedbackCore[] = rows.map(feedback => ({
				id: feedback.id,
				testId: feedback.testId,
				rating: feedback.rating,
				problems: feedback.problems,
				comment: feedback.comment,
				createdAt: feedback.createdAt,
				updatedAt: feedback.updatedAt,
			})); return {
				data,
				page: 1,
				perPage: count,
				total: count,
				totalPages: 1,
			};
		} catch (error) {
			throw new DomainError(`Failed to retrieve feedbacks: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	/**
	 * Get a single feedback by ID
	 */
	static async getFeedbackById(feedbackId: string): Promise<FeedbackCore> {
		try {
			const feedback = await Feedback.findByPk(feedbackId, {
				include: [
					{
						model: Test,
						attributes: ['id', 'title'],
					}
				],
			});

			if (!feedback) {
				throw new DomainError(`Feedback with ID ${feedbackId} not found`);
			}

			return {
				id: feedback.id,
				testId: feedback.testId,
				rating: feedback.rating,
				problems: feedback.problems,
				comment: feedback.comment,
				createdAt: feedback.createdAt,
				updatedAt: feedback.updatedAt,
			};
		} catch (error) {
			if (error instanceof DomainError) {
				throw error;
			}
			throw new DomainError(`Failed to retrieve feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	/**
	 * Create a new feedback
	 */
	static async createFeedback(body: PostFeedbackBody): Promise<FeedbackCore> {
		const transaction = await sequelize.transaction();

		try {
			// Verify that the test exists
			const test = await Test.findByPk(body.testId, { transaction });
			if (!test) {
				throw new DomainError(`Test with ID ${body.testId} not found`);
			}

			// Check if feedback already exists for this test
			const existingFeedback = await Feedback.findOne({
				where: { testId: body.testId },
				transaction,
			});

			if (existingFeedback) {
				throw new DomainError(`Feedback already exists for test ${body.testId}`);
			}

			// Create the feedback
			const feedback = await Feedback.create({
				testId: body.testId,
				rating: body.rating,
				problems: body.problems || [],
				comment: body.comment || "",
			}, { transaction });

			await transaction.commit();

			return {
				id: feedback.id,
				testId: feedback.testId,
				rating: feedback.rating,
				problems: feedback.problems,
				comment: feedback.comment,
				createdAt: feedback.createdAt,
				updatedAt: feedback.updatedAt,
			};
		} catch (error) {
			await transaction.rollback();
			if (error instanceof DomainError) {
				throw error;
			}
			throw new DomainError(`Failed to create feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	/**
	 * Update an existing feedback
	 */
	static async updateFeedback(feedbackId: string, body: PutFeedbackBody): Promise<FeedbackCore> {
		const transaction = await sequelize.transaction();

		try {
			// Verify that the feedback exists
			const feedback = await Feedback.findByPk(feedbackId, { transaction });
			if (!feedback) {
				throw new DomainError(`Feedback with ID ${feedbackId} not found`);
			}

			// Verify that the test exists if testId is being updated
			if (body.testId && body.testId !== feedback.testId) {
				const test = await Test.findByPk(body.testId, { transaction });
				if (!test) {
					throw new DomainError(`Test with ID ${body.testId} not found`);
				}

				// Check if feedback already exists for the new test
				const existingFeedback = await Feedback.findOne({
					where: {
						testId: body.testId,
						id: { [Op.ne]: feedbackId }
					},
					transaction,
				});

				if (existingFeedback) {
					throw new DomainError(`Feedback already exists for test ${body.testId}`);
				}
			}

			// Update the feedback
			await feedback.update({
				testId: body.testId,
				rating: body.rating,
				problems: body.problems || [],
				comment: body.comment || "",
			}, { transaction });

			await transaction.commit();

			// Reload the feedback to get updated timestamps
			await feedback.reload();

			return {
				id: feedback.id,
				testId: feedback.testId,
				rating: feedback.rating,
				problems: feedback.problems,
				comment: feedback.comment,
				createdAt: feedback.createdAt,
				updatedAt: feedback.updatedAt,
			};
		} catch (error) {
			await transaction.rollback();
			if (error instanceof DomainError) {
				throw error;
			}
			throw new DomainError(`Failed to update feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	/**
	 * Delete a feedback
	 */
	static async deleteFeedback(feedbackId: string): Promise<void> {
		const transaction = await sequelize.transaction();

		try {
			// Verify that the feedback exists
			const feedback = await Feedback.findByPk(feedbackId, { transaction });
			if (!feedback) {
				throw new DomainError(`Feedback with ID ${feedbackId} not found`);
			}

			// Delete the feedback
			await feedback.destroy({ transaction });

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			if (error instanceof DomainError) {
				throw error;
			}
			throw new DomainError(`Failed to delete feedback: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	/**
	 * Get feedback by test ID (useful for getting feedback for a specific test)
	 */
	static async getFeedbackByTestId(testId: string): Promise<FeedbackCore | null> {
		try {
			const feedback = await Feedback.findOne({
				where: { testId },
				include: [
					{
						model: Test,
						attributes: ['id', 'title'],
					}
				],
			});

			if (!feedback) {
				return null;
			}

			return {
				id: feedback.id,
				testId: feedback.testId,
				rating: feedback.rating,
				problems: feedback.problems,
				comment: feedback.comment,
				createdAt: feedback.createdAt,
				updatedAt: feedback.updatedAt,
			};
		} catch (error) {
			throw new DomainError(`Failed to retrieve feedback for test: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	/**
	 * Check if feedback exists for a test
	 */
	static async feedbackExistsForTest(testId: string): Promise<boolean> {
		try {
			const count = await Feedback.count({
				where: { testId },
			});
			return count > 0;
		} catch (error) {
			throw new DomainError(`Failed to check feedback existence: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	/**
	 * Get feedback statistics for a test
	 */
	static async getFeedbackStats(testId: string): Promise<{
		count: number;
		averageRating: number;
		mostCommonProblems: string[];
	}> {
		try {
			const feedbacks = await Feedback.findAll({
				where: { testId },
				attributes: ['rating', 'problems'],
			});

			if (feedbacks.length === 0) {
				return {
					count: 0,
					averageRating: 0,
					mostCommonProblems: [],
				};
			}

			// Calculate average rating
			const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
			const averageRating = Number((totalRating / feedbacks.length).toFixed(2));

			// Count problem frequencies
			const problemCounts = new Map<string, number>();
			feedbacks.forEach(feedback => {
				feedback.problems.forEach(problem => {
					problemCounts.set(problem, (problemCounts.get(problem) || 0) + 1);
				});
			});

			// Get most common problems (sorted by frequency)
			const mostCommonProblems = Array.from(problemCounts.entries())
				.sort((a, b) => b[1] - a[1])
				.slice(0, 5)
				.map(([problem]) => problem);

			return {
				count: feedbacks.length,
				averageRating,
				mostCommonProblems,
			};
		} catch (error) {
			throw new DomainError(`Failed to calculate feedback statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}
}