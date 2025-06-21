import { IntervalService } from "../../services/IntervalService";
import { RandomService } from "../../services/RandomService";

export async function initServices() {
	IntervalService.init();
	await RandomService.init();
}