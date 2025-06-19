import { IntervalService } from "../services/IntervalService";
import { RandomService } from "../services/RandomService";

export async function appServices() {
	IntervalService.init();
	await RandomService.init();
}