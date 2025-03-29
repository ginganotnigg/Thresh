import { IEventDTO } from "./event.dto.i";
import { IEventHandler } from "./event.handler.i";

type HandlerFunction<T extends IEventDTO> = (event: T) => void;

class EventDispatcher {
	private handlers: { [event: string]: HandlerFunction<any>[] } = {};

	/**  
	 * Register an event handler for a specific event 
	 */
	public register<T extends IEventDTO>(eventType: new (...args: any[]) => T, handler: IEventHandler<T> | HandlerFunction<T>): void {
		const name = eventType.name;
		if (!this.handlers[name]) {
			this.handlers[name] = [];
		}
		if (typeof handler === 'function') {
			this.handlers[name].push(handler);
		} else {
			this.handlers[name].push(handler.handle.bind(handler));
		}
	}

	/**
	 * Dispatch an event with optional arguments
	 */
	public dispatch(event: IEventDTO): void {
		const eventHandlers = this.handlers[event.constructor.name];
		if (eventHandlers) {
			eventHandlers.forEach(handler => handler(event));
		}
	}
}

export const eventDispatcherInstance = new EventDispatcher();