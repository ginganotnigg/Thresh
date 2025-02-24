import { RequestHandler, Router } from "express";
import { ControllerBase } from "../../common/controller/base/controller.base";
import { QueryService } from "./usecase/query.service";
import { CommandService } from "./usecase/command.service";
import { TestFilterParam } from "./schemas/param";
import { validateHelperNumber, validateHelperObject } from "../../common/controller/helpers/validation.helper";
import { isNumber } from "class-validator";

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
		const filter = await validateHelperObject(req.query, TestFilterParam);
		const tests = await this.query.getTests(filter);
		res.json(tests);
	}

	private getTest: RequestHandler = async (req, res, next) => {
		const testId = validateHelperNumber(req.params.testId);
		const test = await this.query.getTest(testId);
		res.json(test);
	}

	private getTestQuestions: RequestHandler = async (req, res, next) => {
		const testId = validateHelperNumber(req.params.testId);
		const questions = await this.query.getQuestions(testId);
		res.json(questions);
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
		this.route("get", '/tests/:testId/questions', this.getTestQuestions);
		this.route("get", '/manager/:managerId/tests', this.getManagerTests);
		this.route("post", '/tests', this.createTest);
		this.route("put", '/tests/:testId', this.updateTest);
		this.route("delete", '/tests/:testId', this.deleteTest);
	}
}