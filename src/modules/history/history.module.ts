import { Router } from "express";
import { QueryService } from "./services/query.service";
import { HistoryController } from "./history.controller";

export function configModule(router: Router) {
	const query = new QueryService();
	const controller = new HistoryController(router, query);
	controller.initialize();
	console.log('Manage module initialized');
}