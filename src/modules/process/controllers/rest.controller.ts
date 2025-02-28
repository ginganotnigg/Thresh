import { RequestHandler, Router } from 'express';
import CommandUsecase from '../usecase/command.service';
import QueryUsecase from '../usecase/query.service';
import { ControllerBase } from '../../../common/controller/schemas/controller.base';
import { AnswerAttemptParam } from '../usecase/schemas/param';
import { canGuard } from '../../../common/controller/guards/candidate.guard';
import { UserPipe } from '../../../common/controller/pipes/user.pipe';
import { validateHelperNumber, validateHelperObject } from '../../../common/controller/helpers/validation.helper';


export default class RestController extends ControllerBase {
	constructor(
		router: Router,
		private readonly command: CommandUsecase,
		private readonly query: QueryUsecase,
	) {
		super(
			router,
			undefined,
			[canGuard]
		);
	}

	private getCurrent: RequestHandler = async (req, res, next) => {
		const testId = validateHelperNumber(req.params.testId);
		const candidateId = UserPipe.retrive(req).id;
		const current = await this.query.getInProgressAttemptSmall(testId, candidateId);
		res.json(current);
	}

	private startNew: RequestHandler = async (req, res, next) => {
		const testId = validateHelperNumber(req.params.testId);
		const candidateId = UserPipe.retrive(req).id;
		await this.command.startNew(+testId, candidateId);
		res.status(201).end();
	}

	private do: RequestHandler = async (req, res, next) => {
		const testId = validateHelperNumber(req.params.testId);
		const candidateId = UserPipe.retrive(req).id;
		const attemptDetail = await this.query.getInProgressAttemptToDo(+testId, candidateId);
		res.json(attemptDetail);
	}

	private answer: RequestHandler = async (req, res, next) => {
		const testId = validateHelperNumber(req.params.testId);
		const body = await validateHelperObject(req.body, AnswerAttemptParam);
		const candidateId = UserPipe.retrive(req).id;
		await this.command.answer(testId, candidateId, body);
		res.status(201).end();
	}

	private submit: RequestHandler = async (req, res, next) => {
		const testId = validateHelperNumber(req.params.testId);
		const candidateId = UserPipe.retrive(req).id;
		await this.command.submit(testId, candidateId);
		res.status(201).end();
	}

	protected initializeRoutes() {
		this.route("get", '/tests/:testId/current', this.getCurrent);
		this.route("post", '/tests/:testId/current/new', this.startNew);
		this.route("get", '/tests/:testId/current/do', this.do);
		this.route("patch", '/tests/:testId/current/answer', this.answer);
		this.route("post", '/tests/:testId/current/submit', this.submit);
	}
}