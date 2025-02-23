import { RequestHandler, Router } from "express";
import { ControllerBase } from "../../common/controller/base/controller.base";
import { QueryService } from "./usecase/query.service";
import { CommandService } from "./usecase/command.service";
import { TestFilterParam } from "./types/param";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { validateHelper } from "../../common/controller/helpers/validation.helper";

export class ManageController extends ControllerBase {
	constructor(
		router: Router,
		private readonly query: QueryService,
		private readonly command: CommandService
	) {
		super(router);
		this.initializeRoutes();
	}

	private getTests: RequestHandler = async (req, res, next) => {
		const filter = await validateHelper(req.query, TestFilterParam);
		const tests = await this.query.getTests(filter);
		res.json(tests);
	}

	private getTest: RequestHandler = async (req, res, next) => {
	}

	private getSmallTest: RequestHandler = async (req, res, next) => {
	}

	private getManagerTests: RequestHandler = async (req, res, next) => {
	}

	private createTest: RequestHandler = async (req, res, next) => {
	}

	private updateTest: RequestHandler = async (req, res, next) => {
	}

	private deleteTest: RequestHandler = async (req, res, next) => {
	}

	protected initializeRoutes(): void {
		this.route("get", '/tests', this.getTests);
		this.route("get", '/tests/:testId', this.getTest);
		this.route("get", '/tests/:testId/small', this.getSmallTest);
		this.route("get", '/manager/tests', this.getManagerTests);
		this.route("post", '/tests', this.createTest);
		this.route("put", '/tests/:testId', this.updateTest);
		this.route("delete", '/tests/:testId', this.deleteTest);
	}
}