import { RequestHandler, Router } from "express";
import { ControllerBase } from "../../common/controller/base/controller.base";
import Tag from "../../models/tag";
import { validateHelperNumber, validateHelperString } from "../../common/controller/helpers/validation.helper";

export class TagsController extends ControllerBase {
	constructor(
		router: Router
	) {
		super(router, '/tags');
	}

	protected initializeRoutes(): void {
		this.route("get", '/', this.getAll);
		this.route("post", '/', this.create);
		this.route("put", '/:id', this.update);
		this.route("delete", '/:id', this.delete);
	}

	private getAll: RequestHandler = async (req, res, next) => {
		const tags = await Tag.findAll({});
		res.json(tags);
	}

	private create: RequestHandler = async (req, res, next) => {
		const name = req.body.name;
		validateHelperString(name);
		const tag = await Tag.create({ name });
		res.status(201).json(tag);
	}

	private update: RequestHandler = async (req, res, next) => {
		const id = req.params.id;
		const name = req.body.name;
		validateHelperString(name);
		validateHelperNumber(id);
		await Tag.update({ name }, { where: { id } });
		res.status(204).end();
	}

	private delete: RequestHandler = async (req, res, next) => {
		const id = req.params.id;
		validateHelperNumber(id);
		await Tag.destroy({ where: { id } });
		res.status(204).end();
	}
}