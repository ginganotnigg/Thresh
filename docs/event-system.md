# Event Handler Base with Event Queue

This implementation provides a robust event handling system for your DDD-based Node.js application with the following features:

## Features

- **Event Handler Base Classes**: Standardized handlers with built-in retry logic, credentials support, and lifecycle hooks
- **Event Queue**: Reliable event processing with background processing, retries, and persistence
- **Domain Event Integration**: Seamless integration with your existing AggregateRoot pattern
- **Multiple Repository Implementations**: In-memory and Sequelize-based persistence
- **Configurable Processing**: Customizable batch sizes, intervals, and retry policies
- **Audit Logging**: Built-in audit trail for all events
- **Monitoring**: Statistics and health monitoring capabilities

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  AggregateRoot  │───▶│   EventQueue     │───▶│  Event Handlers │
│                 │    │                  │    │                 │
│ - Domain Events │    │ - Persistence    │    │ - Retry Logic   │
│ - Auto Publish  │    │ - Background     │    │ - Credentials   │
└─────────────────┘    │ - Retry Logic    │    │ - Lifecycle     │
                       └──────────────────┘    └─────────────────┘
```

## Quick Start

### 1. Setup Event Dispatcher Service

```typescript
import { eventDispatcher } from "./services/EventDispatcherService";

// Start the event processing
eventDispatcher.start();

// Stop when shutting down
process.on("SIGTERM", () => {
  eventDispatcher.stop();
});
```

### 2. Create Domain Events

```typescript
import { DomainEvent } from "../shared/domain/DomainEvent";

export class AttemptCreatedEvent extends DomainEvent {
  public readonly eventType = "AttemptCreated";

  constructor(
    public readonly attemptId: string,
    public readonly testId: string,
    public readonly candidateId: string,
    public readonly order: number
  ) {
    super();
  }
}
```

### 3. Create Event Handlers

```typescript
import { EventHandlerBase } from "../shared/base/event-handler.base";
import { AttemptCreatedEvent } from "../events/AttemptEvents";

export class AttemptCreatedHandler extends EventHandlerBase<AttemptCreatedEvent> {
  async handle(event: AttemptCreatedEvent): Promise<void> {
    // Your business logic here
    console.log(`Processing attempt ${event.attemptId}`);
  }

  canHandle(event: IDomainEvent): boolean {
    return event.eventType === "AttemptCreated";
  }

  getPriority(): number {
    return 10; // Lower = higher priority
  }

  isBackground(): boolean {
    return true; // Process in background
  }
}
```

### 4. Emit Events from Aggregates

```typescript
export class AttemptAggregate extends AggregateRoot {
  submit(credentials: CredentialsBase): void {
    // Business logic
    this.attempt.status = "COMPLETED";

    // Add domain event
    this.addDomainEvent(
      new AttemptSubmittedEvent(
        this.id,
        this.attempt.testId,
        this.attempt.candidateId,
        this.attempt.secondsSpent,
        new Date()
      )
    );
  }

  async save(credentials?: CredentialsMeta): Promise<void> {
    // Save to repository
    await AttemptRepo.save(this);

    // Publish and clear domain events
    await this.publishAndClearDomainEvents(credentials);
  }
}
```

## Event Handler Types

### Single Event Handler

```typescript
export class SpecificEventHandler extends EventHandlerBase<MyEvent> {
  async handle(event: MyEvent): Promise<void> {
    // Handle single event type
  }

  canHandle(event: IDomainEvent): boolean {
    return event.eventType === "MyEventType";
  }
}
```

### Multi Event Handler

```typescript
export class AuditHandler extends MultiEventHandlerBase {
  async handle(event: IDomainEvent): Promise<void> {
    // Handle multiple event types
  }

  getSupportedEventTypes(): string[] {
    return ["AttemptCreated", "AttemptSubmitted", "AnswerUpdated"];
  }
}
```

## Configuration

### Environment Variables

```bash
# Event Queue Configuration
USE_DATABASE_EVENT_QUEUE=true
EVENT_QUEUE_BATCH_SIZE=50
EVENT_QUEUE_PROCESSING_INTERVAL=1000
EVENT_QUEUE_BACKGROUND_INTERVAL=5000
EVENT_QUEUE_MAX_CONCURRENT=10
EVENT_QUEUE_ENABLE_RETRIES=true
EVENT_QUEUE_CLEANUP_INTERVAL=3600000
EVENT_QUEUE_RETENTION_DAYS=7
```

### Database Setup (if using SequelizeEventQueueRepository)

```sql
-- Migration to create event_queue table
CREATE TABLE EventQueue (
  id UUID PRIMARY KEY,
  eventType VARCHAR(255) NOT NULL,
  eventData TEXT NOT NULL,
  handlerName VARCHAR(255) NOT NULL,
  attempts INTEGER DEFAULT 0,
  maxAttempts INTEGER DEFAULT 4,
  nextRetryAt TIMESTAMP NULL,
  createdAt TIMESTAMP NOT NULL,
  updatedAt TIMESTAMP NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  priority INTEGER DEFAULT 100,
  isBackground BOOLEAN DEFAULT false,
  error TEXT NULL,
  credentialsUserId VARCHAR(255) NULL,
  credentialsRole ENUM('MANAGER', 'CANDIDATE') NULL
);

-- Indexes for performance
CREATE INDEX idx_event_queue_status ON EventQueue(status);
CREATE INDEX idx_event_queue_event_type ON EventQueue(eventType);
CREATE INDEX idx_event_queue_priority ON EventQueue(priority);
CREATE INDEX idx_event_queue_created_at ON EventQueue(createdAt);
CREATE INDEX idx_event_queue_is_background ON EventQueue(isBackground);
CREATE INDEX idx_event_queue_next_retry_at ON EventQueue(nextRetryAt);
```

## Handler Configuration Options

```typescript
export class MyEventHandler extends EventHandlerBase<MyEvent> {
  getPriority(): number {
    return 50; // Lower = higher priority (default: 100)
  }

  isBackground(): boolean {
    return true; // Process in background (default: false)
  }

  getMaxRetries(): number {
    return 5; // Max retry attempts (default: 3)
  }

  getRetryDelay(): number {
    return 2000; // Delay between retries in ms (default: 1000)
  }

  // Lifecycle hooks
  protected async onBeforeHandle(event: MyEvent): Promise<void> {
    // Called before handle()
  }

  protected async onAfterHandle(event: MyEvent): Promise<void> {
    // Called after successful handle()
  }

  protected async onFailure(
    event: MyEvent,
    error: Error,
    attemptNumber: number
  ): Promise<void> {
    // Called when all retry attempts fail
  }
}
```

## Monitoring and Management

### Get Queue Statistics

```typescript
const stats = await eventDispatcher.getStats();
console.log(stats);
// {
//   pending: 5,
//   processing: 2,
//   completed: 100,
//   failed: 1,
//   activeHandlers: 2
// }
```

### Retry Failed Events

```typescript
const retriedCount = await eventDispatcher.retryFailedEvents(10);
console.log(`Retried ${retriedCount} failed events`);
```

## Best Practices

1. **Event Naming**: Use descriptive, past-tense event names (e.g., `AttemptCreated`, `AnswerSubmitted`)
2. **Handler Priorities**: Use lower numbers for critical handlers
3. **Background Processing**: Use background processing for non-critical operations
4. **Error Handling**: Implement proper error handling and logging in handlers
5. **Credentials**: Pass credentials when publishing events that require authorization
6. **Cleanup**: Regularly clean up old completed events to maintain performance

## Integration with Existing Code

To integrate with your existing attempt handling:

```typescript
// In your existing AttemptRepo or service
export class AttemptRepo {
  static async save(
    agg: AttemptAggregate,
    credentials?: CredentialsMeta
  ): Promise<void> {
    // Your existing save logic
    const persistence = agg.getPersistenceData();
    await Attempt.update(persistence, { where: { id: persistence.id } });

    // NEW: Publish domain events
    await agg.publishAndClearDomainEvents(credentials);
  }
}
```

This event system provides a solid foundation for building event-driven features while maintaining your existing DDD architecture patterns.
