import { Op, Transaction, WhereOptions } from "sequelize";
import sequelize from "../../configs/orm/sequelize/sequelize";
import { DomainError } from "../../shared/errors/domain.error";
import { CredentialsMeta } from "../../shared/schemas/meta";
import { Paged } from "../../shared/controller/schemas/base";
import Template from "../../infrastructure/models/template";
import {
	TemplateCore,
	GetTemplatesQuery,
	PostTemplateBody,
	PutTemplateBody,
	GetTemplateResponse,
	GetTemplatesResponse
} from "./schema";

export class TemplateCrudService {
	private constructor(
		private readonly credentials: CredentialsMeta,
	) { }

	static load(credentials: CredentialsMeta): TemplateCrudService {
		return new TemplateCrudService(credentials);
	}

	/**
	 * Create a new template
	 */
	async create(body: PostTemplateBody): Promise<{ templateId: string }> {
		const transaction = await sequelize.transaction();
		try {
			if (!this.credentials.userId) {
				throw new DomainError("User ID is required to create a template");
			}

			const template = await Template.create({
				...body,
				userId: this.credentials.userId,
			}, { transaction });

			await transaction.commit();

			return { templateId: template.id };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	/**
	 * Get a single template by ID
	 */
	async getById(templateId: string): Promise<GetTemplateResponse> {
		const template = await Template.findByPk(templateId);

		if (!template) {
			throw new DomainError(`Template with id ${templateId} not found`);
		}

		// Check if user has access to this template
		if (template.userId !== this.credentials.userId) {
			throw new DomainError("You are not authorized to access this template");
		}

		return this.mapTemplateToResponse(template);
	}

	/**
	 * Get paginated list of templates with filters and sorting
	 */
	async getAll(query: GetTemplatesQuery): Promise<GetTemplatesResponse> {
		if (!this.credentials.userId) {
			throw new DomainError("User ID is required to fetch templates");
		}

		const {
			page = 1,
			perPage = 10,
			search,
			sortByCreatedAt,
			sortByName,
			filterTags,
			filterDifficulty
		} = query;

		// Build where conditions
		const whereConditions: WhereOptions = {
			userId: this.credentials.userId
		};

		// Search filter
		if (search) {
			(whereConditions as any)[Op.or] = [
				{ name: { [Op.like]: `%${search}%` } },
				{ title: { [Op.like]: `%${search}%` } },
				{ description: { [Op.like]: `%${search}%` } }
			];
		}

		// Tags filter
		if (filterTags && filterTags.length > 0) {
			whereConditions.tags = {
				[Op.overlap]: filterTags
			};
		}

		// Difficulty filter
		if (filterDifficulty && filterDifficulty.length > 0) {
			whereConditions.difficulty = {
				[Op.in]: filterDifficulty
			};
		}

		// Build order clause
		const order: any[] = [];
		if (sortByCreatedAt) {
			const sortOrder = sortByCreatedAt === 'asc' ? 'ASC' : 'DESC';
			order.push(['createdAt', sortOrder]);
		}
		if (sortByName) {
			const sortOrder = sortByName === 'asc' ? 'ASC' : 'DESC';
			order.push(['name', sortOrder]);
		}

		// Default sorting if none specified
		if (order.length === 0) {
			order.push(['createdAt', 'DESC']);
		}

		const offset = (page - 1) * perPage;

		const { count, rows } = await Template.findAndCountAll({
			where: whereConditions,
			order,
			limit: perPage,
			offset,
		});

		const templates = rows.map(template => this.mapTemplateToResponse(template));

		return {
			data: templates,
			page,
			perPage,
			total: count,
			totalPages: Math.ceil(count / perPage),
		};
	}

	/**
	 * Update an existing template
	 */
	async update(templateId: string, body: PutTemplateBody): Promise<void> {
		const transaction = await sequelize.transaction();
		try {
			const template = await Template.findByPk(templateId, { transaction });

			if (!template) {
				throw new DomainError(`Template with id ${templateId} not found`);
			}

			// Check ownership
			if (template.userId !== this.credentials.userId) {
				throw new DomainError("You are not authorized to update this template");
			}

			// Update template
			await template.update({
				name: body.name,
				title: body.title,
				description: body.description,
				language: body.language,
				minutesToAnswer: body.minutesToAnswer,
				difficulty: body.difficulty,
				tags: body.tags,
				numberOfQuestions: body.numberOfQuestions,
				numberOfOptions: body.numberOfOptions,
				outlines: body.outlines,
			}, { transaction });

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	/**
	 * Delete a template
	 */
	async delete(templateId: string): Promise<{ success: boolean }> {
		const transaction = await sequelize.transaction();
		try {
			const template = await Template.findByPk(templateId, { transaction });

			if (!template) {
				throw new DomainError(`Template with id ${templateId} not found`);
			}

			// Check ownership
			if (template.userId !== this.credentials.userId) {
				throw new DomainError("You are not authorized to delete this template");
			}

			await template.destroy({ transaction });
			await transaction.commit();

			return { success: true };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	/**
	 * Get templates by user ID (for admin purposes)
	 */
	async getByUserId(userId: string, query: GetTemplatesQuery): Promise<GetTemplatesResponse> {
		const {
			page = 1,
			perPage = 10,
			search,
			sortByCreatedAt,
			sortByName,
			filterTags,
			filterDifficulty
		} = query;

		// Build where conditions
		const whereConditions: WhereOptions = {
			userId: userId
		};

		// Search filter
		if (search) {
			(whereConditions as any)[Op.or] = [
				{ name: { [Op.like]: `%${search}%` } },
				{ title: { [Op.like]: `%${search}%` } },
				{ description: { [Op.like]: `%${search}%` } }
			];
		}

		// Tags filter
		if (filterTags && filterTags.length > 0) {
			whereConditions.tags = {
				[Op.overlap]: filterTags
			};
		}

		// Difficulty filter
		if (filterDifficulty && filterDifficulty.length > 0) {
			whereConditions.difficulty = {
				[Op.in]: filterDifficulty
			};
		}

		// Build order clause
		const order: any[] = [];
		if (sortByCreatedAt) {
			const sortOrder = sortByCreatedAt === 'asc' ? 'ASC' : 'DESC';
			order.push(['createdAt', sortOrder]);
		}
		if (sortByName) {
			const sortOrder = sortByName === 'asc' ? 'ASC' : 'DESC';
			order.push(['name', sortOrder]);
		}

		// Default sorting if none specified
		if (order.length === 0) {
			order.push(['createdAt', 'DESC']);
		}

		const offset = (page - 1) * perPage;

		const { count, rows } = await Template.findAndCountAll({
			where: whereConditions,
			order,
			limit: perPage,
			offset,
		});

		const templates = rows.map(template => this.mapTemplateToResponse(template));

		return {
			data: templates,
			page,
			perPage,
			total: count,
			totalPages: Math.ceil(count / perPage),
		};
	}

	/**
	 * Bulk delete templates
	 */
	async bulkDelete(templateIds: string[]): Promise<{ deletedCount: number }> {
		const transaction = await sequelize.transaction();
		try {
			if (!this.credentials.userId) {
				throw new DomainError("User ID is required to delete templates");
			}

			// Find templates that belong to the user
			const templates = await Template.findAll({
				where: {
					id: {
						[Op.in]: templateIds
					},
					userId: this.credentials.userId
				},
				transaction
			});

			if (templates.length === 0) {
				throw new DomainError("No templates found or you don't have permission to delete them");
			}

			const deletedCount = await Template.destroy({
				where: {
					id: {
						[Op.in]: templates.map(t => t.id)
					},
					userId: this.credentials.userId
				},
				transaction
			});

			await transaction.commit();

			return { deletedCount };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	/**
	 * Duplicate a template
	 */
	async duplicate(templateId: string, newName?: string): Promise<{ templateId: string }> {
		const transaction = await sequelize.transaction();
		try {
			if (!this.credentials.userId) {
				throw new DomainError("User ID is required to duplicate a template");
			}

			const originalTemplate = await Template.findByPk(templateId, { transaction });

			if (!originalTemplate) {
				throw new DomainError(`Template with id ${templateId} not found`);
			}

			// Check ownership or if it's a public template (you might want to add a public field)
			if (originalTemplate.userId !== this.credentials.userId) {
				throw new DomainError("You are not authorized to duplicate this template");
			}

			const duplicatedTemplate = await Template.create({
				userId: this.credentials.userId,
				name: newName || `${originalTemplate.name} (Copy)`,
				title: originalTemplate.title,
				description: originalTemplate.description,
				language: originalTemplate.language,
				minutesToAnswer: originalTemplate.minutesToAnswer,
				difficulty: originalTemplate.difficulty,
				tags: originalTemplate.tags,
				numberOfQuestions: originalTemplate.numberOfQuestions,
				numberOfOptions: originalTemplate.numberOfOptions,
				outlines: originalTemplate.outlines,
			}, { transaction });

			await transaction.commit();

			return { templateId: duplicatedTemplate.id };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	}

	/**
	 * Get template statistics
	 */
	async getStatistics(userId?: string): Promise<{
		totalTemplates: number;
		templatesByDifficulty: Record<string, number>;
		templatesByLanguage: Record<string, number>;
		averageMinutesToAnswer: number;
		averageNumberOfQuestions: number;
	}> {
		if (!this.credentials.userId) {
			throw new DomainError("User ID is required to get statistics");
		}

		const whereConditions: WhereOptions = {
			userId: this.credentials.userId
		};

		if (userId) {
			whereConditions.userId = userId;
		}

		const templates = await Template.findAll({
			where: whereConditions,
			attributes: ['difficulty', 'language', 'minutesToAnswer', 'numberOfQuestions']
		});

		const totalTemplates = templates.length;
		const templatesByDifficulty: Record<string, number> = {};
		const templatesByLanguage: Record<string, number> = {};
		let totalMinutes = 0;
		let totalQuestions = 0;

		templates.forEach(template => {
			// Difficulty statistics
			templatesByDifficulty[template.difficulty] =
				(templatesByDifficulty[template.difficulty] || 0) + 1;

			// Language statistics
			templatesByLanguage[template.language] =
				(templatesByLanguage[template.language] || 0) + 1;

			totalMinutes += template.minutesToAnswer;
			totalQuestions += template.numberOfQuestions;
		});

		return {
			totalTemplates,
			templatesByDifficulty,
			templatesByLanguage,
			averageMinutesToAnswer: totalTemplates > 0 ? Math.round(totalMinutes / totalTemplates) : 0,
			averageNumberOfQuestions: totalTemplates > 0 ? Math.round(totalQuestions / totalTemplates) : 0,
		};
	}

	/**
	 * Map Sequelize model to response format
	 */
	private mapTemplateToResponse(template: Template): TemplateCore {
		return {
			id: template.id,
			userId: template.userId,
			name: template.name,
			title: template.title,
			description: template.description,
			language: template.language,
			minutesToAnswer: template.minutesToAnswer,
			difficulty: template.difficulty,
			tags: template.tags,
			numberOfQuestions: template.numberOfQuestions,
			numberOfOptions: template.numberOfOptions,
			outlines: template.outlines,
			createdAt: template.createdAt,
			updatedAt: template.updatedAt,
		};
	}
}