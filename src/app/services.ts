import { IntervalService } from "../shared/services/interval.service";
import { RandomService } from "../shared/services/random.service";

export async function appServices() {
	IntervalService.init();
	await RandomService.init();
}