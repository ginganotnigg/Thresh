import { Router } from "express";
import { ManageController } from "./manage.controller";
import { CommandService } from "./services/command.service";
import { QueryService } from "./services/query.service";

export function configModule(router: Router) {
	const command = new CommandService();
	const query = new QueryService();
	const controller = new ManageController(router, query, command);
	controller.initialize();
	console.log('Manage module initialized');
}