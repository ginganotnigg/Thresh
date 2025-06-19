import { Constructor } from "../../library/caychuoijs/utils/type";
import { EventHandlerBase } from "../handler/usecase.base";
import { AggregateRoot } from "./AggregateRoot";
import { DomainEventBase } from "./DomainEventBase";

export class EventDispatcher {
	private static instance: EventDispatcher;
	private handlers: Map<string, EventHandlerBase<any>[]> = new Map();

	private constructor() { }

	public static getInstance(): EventDispatcher {
		if (!EventDispatcher.instance) {
			EventDispatcher.instance = new EventDispatcher();
		}
		return EventDispatcher.instance;
	}

	public register<T extends DomainEventBase>(event: Constructor<T>, handler: EventHandlerBase<T>): void {
		const eventName = event.name;
		if (!this.handlers.has(eventName)) {
			this.handlers.set(eventName, []);
		}
		this.handlers.get(eventName)?.push(handler);
	}

	public async dispatch<T extends DomainEventBase>(event: T): Promise<void> {
		const eventName = event.constructor.name;
		const handlers = this.handlers.get(eventName);
		if (handlers) {
			for (const handler of handlers) {
				await handler.handle(event);
			}
		}
	}

	public async dispatchAggregate<TId>(aggregate: AggregateRoot<TId>): Promise<void> {
		const events = aggregate.getDomainEvents();
		for (const event of events) {
			await this.dispatch(event);
		}
		aggregate.clearDomainEvents();
	}
}

