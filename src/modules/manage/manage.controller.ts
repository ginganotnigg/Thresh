import { RequestHandler, Router } from "express";
import { ControllerBase } from "../../common/controller/base/controller.base";
import { QueryService } from "./services/query.service";
import { CommandService } from "./services/command.service";
import { TestCreateParam, TestFilterParam, TestUpdateParam } from "./schemas/param";
import { validateHelperNumber, validateHelperObject, validateHelperString } from "../../common/controller/helpers/validation.helper";
import { validateCreateTestParam, validateUpdateTestParam } from "./schemas/validator";
import { manGuard } from "../../common/controller/middlewares/guards/role.guard";
import { UserPipe, userPipe } from "../../common/controller/middlewares/pipes/user.pipe";

export class ManageController extends ControllerBase {
	constructor(
		router: Router,
		private readonly query: QueryService,
		private readonly command: CommandService
	) { super(router); }

	private getTests: RequestHandler = async (req, res, next) => {
		const query = await validateHelperObject(req.query, TestFilterParam);
		const tests = await this.query.getTests(query);
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
		const managerId = UserPipe.retrive(req).id;
		const query = await validateHelperObject(req.query, TestFilterParam);
		const tests = await this.query.getManagerTests(managerId, query);
		res.json(tests);
	}

	private createTest: RequestHandler = async (req, res, next) => {
		const body = await validateHelperObject(req.body, TestCreateParam);
		validateCreateTestParam(body);
		await this.command.createTest(body);
		res.json({ message: "Test created" });
	}

	private updateTest: RequestHandler = async (req, res, next) => {
		const testId = validateHelperNumber(req.params.testId);
		const body = await validateHelperObject(req.body, TestUpdateParam);
		validateUpdateTestParam(body);
		await this.command.updateTest({ ...body, id: testId });
		res.json({ message: "Test updated" });
	}

	private deleteTest: RequestHandler = async (req, res, next) => {
		const testId = validateHelperNumber(req.params.testId);
		await this.command.deleteTest(testId);
		res.json({ message: "Test deleted" });
	}

	protected initializeRoutes(): void {
		this.route("get", '/tests', this.getTests);
		this.route("get", '/tests/:testId', this.getTest);
		this.route("get", '/tests/:testId/questions', this.getTestQuestions, [manGuard]);
		this.route("get", '/manager/tests', this.getManagerTests, [manGuard]);
		this.route("post", '/tests', this.createTest, [manGuard]);
		this.route("put", '/tests/:testId', this.updateTest, [manGuard]);
		this.route("delete", '/tests/:testId', this.deleteTest, [manGuard]);
	}
}