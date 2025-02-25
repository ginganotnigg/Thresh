import { RequestHandler, Router } from "express";
import { ControllerBase } from "../../common/controller/base/controller.base"
import { QueryService } from "./services/query.service";
import { validateHelperNumber, validateHelperObject, validateHelperString } from "../../common/controller/helpers/validation.helper";
import { AttemptAnswerFilterParam, AttemptFilterParam } from "./schemas/param";
import { RequestWithUser } from "../../common/controller/base/middleware";

export class HistoryController extends ControllerBase {
	constructor(
		router: Router,
		private readonly query: QueryService
	) { super(router); }

	private getTestAttempts: RequestHandler = async (req, res, next) => {
		const testId = validateHelperNumber(req.params.testId);
		const filter = await validateHelperObject(req.query, AttemptFilterParam);
		const result = await this.query.getTestAttempts(testId, filter);
		res.json(result);
	}

	private getAttemptDetail: RequestHandler = async (req, res, next) => {
		const attemptId = validateHelperNumber(req.params.attemptId);
		const result = await this.query.getAttemptDetail(attemptId);
		res.json(result);
	}

	private getAttemptAnswers: RequestHandler = async (req, res, next) => {
		const attemptId = validateHelperNumber(req.params.attemptId);
		const filter = await validateHelperObject(req.query, AttemptAnswerFilterParam);
		const result = await this.query.getAttemptAnswers(attemptId, filter);
		res.json(result);
	}

	private getCandidateAttempts: RequestHandler = async (req, res, next) => {
		const candidateId = validateHelperString((req as RequestWithUser).user.id);
		const filter = await validateHelperObject(req.query, AttemptFilterParam);
		const result = await this.query.getCandidateAttempts(candidateId, filter);
		res.json(result);
	}

	private getCandidateAttempt: RequestHandler = async (req, res, next) => {
		const candidateId = validateHelperString((req as RequestWithUser).user.id);
		const testId = validateHelperNumber(req.params.testId);
		const filter = await validateHelperObject(req.query, AttemptFilterParam);
		const result = await this.query.getCandidateAttempt(candidateId, testId, filter);
		res.json(result);
	}

	protected initializeRoutes(): void {
		this.route("get", '/tests/:testId/attempts', this.getTestAttempts);
		this.route("get", '/attempts/:attemptId', this.getAttemptDetail);
		this.route("get", '/attempts/:attemptId/answers', this.getAttemptAnswers);
		this.route("get", '/candidate/attempts', this.getCandidateAttempts);
		this.route("get", '/candidate/test/:testId/attempts', this.getCandidateAttempt);
	}
}