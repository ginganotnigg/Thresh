import { IntervalService } from "../services/interval.service";

export async function configServices() {
	IntervalService.init();
}