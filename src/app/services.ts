import { IntervalService } from "../services/interval.service";
import { RandomService } from "../services/random.service";

export async function appServices() {
	IntervalService.init();
	await RandomService.init();
}