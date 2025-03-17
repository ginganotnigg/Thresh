import { IEventDTO } from "./event.dto.i";

export interface IEventHandler<T extends IEventDTO> {
	handle(event: T): void;
}