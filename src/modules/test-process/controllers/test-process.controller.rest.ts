import { RequestHandler } from 'express';
import CommandUsecase from '../usecase/commands/command';
import QueryUsecase from '../usecase/queries/query';
import { ControllerBase } from '../../../common/controller/controller.base';
import { AnswerAttemptParam } from '../usecase/commands/param';
import { middlewareInjectorInstance } from '../../../common/controller/middlewares/middleware.inject';
import { UserRole as UserRole, RoleMiddleware } from '../../../common/controller/middlewares/role.mdw';

const candidateId = "C#0T001";

export default class RestController extends ControllerBase {
	constructor(
		private readonly command: CommandUsecase,
		private readonly query: QueryUsecase
	) {
		super(
			undefined,
			[
				middlewareInjectorInstance.getTransient(RoleMiddleware, UserRole.CANDIDATE)
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
		const attemptDetail = await this.query.getInProgressAttemptDetailToDo(+testId, candidateId);
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
		this.route("post", '/tests/:testId/current/answer', this.answer);
		this.route("post", '/tests/:testId/current/submit', this.submit);
	}
}