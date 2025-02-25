import { RequestHandler, Router } from 'express';
import CommandUsecase from '../usecase/commands/command';
import QueryUsecase from '../usecase/queries/query';
import { ControllerBase } from '../../../common/controller/base/controller.base';
import { AnswerAttemptParam } from '../usecase/commands/param';
import { UserRole as UserRole, RoleGuard } from '../../../common/controller/guards/role.guard';
import { middlewareInjectorInstance } from '../../../common/controller/helpers/middleware.inject';

const candidateId = "C#0T001";

export default class RestController extends ControllerBase {
	constructor(
		router: Router,
		private readonly command: CommandUsecase,
		private readonly query: QueryUsecase,
	) {
		super(
			router,
			undefined,
			[
				middlewareInjectorInstance.getTransient(RoleGuard, UserRole.CANDIDATE)
			]
		);
	}

	private getCurrent: RequestHandler = async (req, res, next) => {
		const { testId } = req.params;
		const current = await this.query.getInProgressAttemptSmall(testId, candidateId);
		res.json(current);
	}

	private startNew: RequestHandler = async (req, res, next) => {
		const { testId } = req.params;
		await this.command.startNew(+testId, candidateId);
		res.status(201).end();
	}

	private do: RequestHandler = async (req, res, next) => {
		const { testId } = req.params;
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
		await this.command.answer(answerParam, candidateId);
		res.status(201).end();
	}

	private submit: RequestHandler = async (req, res, next) => {
		const { testId } = req.params;
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