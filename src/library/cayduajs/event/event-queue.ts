import { IEventDTO } from "./event.dto.i";
import { IEventHandler } from "./event.handler.i";

class EventDispatcher {
	private handlers: { [event: string]: IEventHandler[] } = {};

	/**  
	 * Register an event handler for a specific event 
	 */
	public register(eventType: new (...args: any[]) => IEventDTO, handler: IEventHandler): void {
		const name = eventType.name;
		if (!this.handlers[name]) {
			this.handlers[name] = [];
		}
		this.handlers[name].push(handler);
	}

	/**
	 * Dispatch an event with optional arguments
	 */
	public dispatch(event: IEventDTO): void {
		const eventHandlers = this.handlers[event.constructor.name];
		if (eventHandlers) {
			eventHandlers.forEach(handler => handler.handle(event));
		}
	}

	/**
	 * Remove an event handler for a specific event
	 */
	public remove(eventType: new (...args: any[]) => IEventDTO, handler: IEventHandler): void {
		const name = eventType.name;
		const eventHandlers = this.handlers[name];
		if (eventHandlers) {
			this.handlers[name] = eventHandlers.filter(h => h !== handler);
		}
		if (this.handlers[name].length === 0) {
			delete this.handlers[name];
		}
	}
}

export const eventDispatcherInstance = new EventDispatcher();