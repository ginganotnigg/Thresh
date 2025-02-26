import { RequestHandler, Router } from 'express';
import CommandUsecase from '../usecase/command.service';
import QueryUsecase from '../usecase/query.service';
import { ControllerBase } from '../../../common/controller/base/controller.base';
import { AnswerAttemptParam } from '../usecase/schemas/param';
import { canGuard } from '../../../common/controller/middlewares/guards/role.guard';
import { UserPipe } from '../../../common/controller/middlewares/pipes/user.pipe';


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
		const { testId } = req.params;
		const candidateId = UserPipe.retrive(req).id;
		const current = await this.query.getInProgressAttemptSmall(testId, candidateId);
		res.json(current);
	}

	private startNew: RequestHandler = async (req, res, next) => {
		const { testId } = req.params;
		const candidateId = UserPipe.retrive(req).id;
		await this.command.startNew(+testId, candidateId);
		res.status(201).end();
	}

	private do: RequestHandler = async (req, res, next) => {
		const { testId } = req.params;
		const candidateId = UserPipe.retrive(req).id;
		const attemptDetail = await this.query.getInProgressAttemptToDo(+testId, candidateId);
		res.json(attemptDetail);
	}

	private answer: RequestHandler = async (req, res, next) => {
		const { testId } = req.params;
		const { questionId, optionId } = req.body;
		const answerParam: AnswerAttemptParam = {
			testId: +testId,
			questionId: +questionId,
			optionId: optionId ? +optionId : undefined
		};
		const candidateId = UserPipe.retrive(req).id;
		await this.command.answer(answerParam, candidateId);
		res.status(201).end();
	}

	private submit: RequestHandler = async (req, res, next) => {
		const { testId } = req.params;
		const candidateId = UserPipe.retrive(req).id;
		await this.command.submit(+testId, candidateId);
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