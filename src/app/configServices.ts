import { IntervalService } from "../services/interval.service";
import { RandomService } from "../services/random.service";

export async function configServices() {
	await IntervalService.init();
	await RandomService.init();
}