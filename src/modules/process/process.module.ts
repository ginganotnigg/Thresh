import { Router } from "express";
import { Namespace } from "socket.io";
import RestController from "./controllers/rest.controller";
import CommandUsecase from "./usecase/command.service";
import WriteRepository from "./infra/repository/write.repo";
import RetriverRepository from "./infra/repository/retriver.repo";
import { AttemptService } from "./domain/domain.service";
import QueryUsecase from "./usecase/query.service";
import { SocketController } from "./controllers/socket.controller";
import { Loader } from "./loader";
import { ModuleBase } from "../../common/module/module.base";

export class ProcessModule extends ModuleBase {
	constructor(
		router: Router,
		private readonly namespace: Namespace
	) { super(router); }

	async _initialize(): Promise<void> {
		const writeRepo = new WriteRepository();
		const retriveRepo = new RetriverRepository();
		const attemptService = new AttemptService(retriveRepo, writeRepo);

		const command = new CommandUsecase(retriveRepo, writeRepo, attemptService);
		const query = new QueryUsecase();

		const socketController = new SocketController(this.namespace, query);
		const controller = new RestController(this.router, command, query);

		controller.initialize();
		socketController.initialize();

		const loader = new Loader(retriveRepo, attemptService);
		await loader.initialize();
	}
}