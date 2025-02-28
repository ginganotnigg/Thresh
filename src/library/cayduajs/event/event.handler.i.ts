import { IEventDTO } from "./event.dto.i";

export interface IEventHandler {
	handle(event: IEventDTO): void;
}