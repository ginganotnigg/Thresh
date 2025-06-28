# Thresh - Backend Architecture Documentation

## 1. System Overview

**Thresh** is a comprehensive exam and practice test management backend system built with Node.js and Express.js. The system enables creation, management, and execution of both practice tests and formal exams with real-time features and automated evaluation capabilities.

### Key Features

- **Test Management**: Create and manage practice tests and exams
- **Real-time Exam Experience**: WebSocket-based real-time communication
- **Automated Evaluation**: Support for MCQ and long-answer questions
- **User Management**: Candidate and examiner roles
- **Message Queue Integration**: Asynchronous processing with RabbitMQ
- **Comprehensive API**: RESTful API with OpenAPI documentation

## 2. Architecture Style

The system follows **Domain-Driven Design (DDD)** principles combined with **Clean Architecture** patterns:

- **Domain-Centric Design**: Business logic is isolated in the domain layer
- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Repository Pattern**: Data access abstraction
- **CQRS-like Approach**: Separation of command and query responsibilities
- **Event-Driven Architecture**: Domain events for cross-cutting concerns

## 3. Technology Stack

### Core Technologies

- **Runtime**: Node.js with TypeScript
- **Web Framework**: Express.js
- **Database**: MySQL with dual ORM approach
  - **Sequelize**: For complex operations and migrations
  - **Kysely**: For type-safe query building
- **Real-time Communication**: Socket.IO
- **Message Broker**: RabbitMQ (AMQP)
- **Protocol Buffers**: For structured data serialization

### Development & Quality

- **Testing**: Jest for unit and integration testing
- **API Documentation**: OpenAPI 3.0 with Swagger UI
- **Validation**: Zod for runtime type validation
- **Logging**: Winston for structured logging
- **Process Management**: Custom scheduling with node-cron

## 4. Layer Architecture

### 4.1 Domain Layer (`src/domain/`)

The core business logic layer containing:

#### Aggregates

- **TestAggregate**: Manages test creation and lifecycle
- **AttemptAggregate**: Handles test attempt execution
- **ExamAggregate**: Manages exam-specific operations
- **TestAttemptsAggregate**: Coordinates attempts for a specific test

#### Entities

- **QuestionEntity**: Individual questions within tests
- **AnswerEntity**: User responses to questions
- **AttemptEntity**: Test attempt instances

#### Domain Events

```typescript
// Example: AttemptEndedEvent, AttemptCreatedEvent
export class AttemptEndedEvent extends DomainEventBase {
  constructor(public readonly attemptId: string) {
    super();
  }
}
```

#### Value Objects & Mappers

- **Mappers**: Convert between domain models, DTOs, and persistence models
- **Type Definitions**: Strong typing for domain concepts

### 4.2 Application Layer (`src/controllers/`, `src/services/`)

#### Controllers

Organized by feature/bounded context:

- **AttemptsController**: Test attempt operations
- **TestsController**: Test management
- **CandidatesController**: User management
- **TemplatesController**: Template management
- **FeedbackController**: Feedback and evaluation

#### Application Services

- **IntervalService**: Scheduled task management
- **MessageBrokerService**: Async message handling
- **RandomService**: Utility services

#### Use Case Handlers

```typescript
// Example: Command Handler Pattern
export class PostTestHandler extends CommandHandlerBase<
  PostTestBody,
  { testId: string }
> {
  async handle(params: PostTestBody): Promise<{ testId: string }> {
    // Business logic implementation
  }
}
```

### 4.3 Infrastructure Layer (`src/infrastructure/`)

#### Repository Implementation

```typescript
export class TestRepo extends RepoBase<TestAggregate> {
  protected async _save(agg: TestAggregate): Promise<void> {
    // Persistence logic with transaction handling
  }

  async getById(testId: string): Promise<TestAggregate> {
    // Complex data retrieval and mapping
  }
}
```

#### Database Models

- **Sequelize Models**: For ORM operations
- **Kysely Integration**: Type-safe query building
- **Migration Management**: Database schema evolution

#### Message Queues

- **RabbitMQ Integration**: Async processing
- **Event Handlers**: Domain event processing

### 4.4 Presentation Layer (`src/app/`, Custom Framework)

#### Custom Web Framework (CayChoi.js)

A custom-built framework providing:

- **Decorator-based Routing**: Type-safe API definition
- **Schema Validation**: Automatic request/response validation
- **Security Integration**: Authentication and authorization
- **OpenAPI Generation**: Automatic documentation

```typescript
// Example endpoint definition
@Post('/tests')
.schema({
    body: PostTestBodySchema,
    response: PostTestResponseSchema
})
.handle(async (data) => {
    const handler = new PostTestHandler();
    return await handler.handle(data.body);
})
```

## 5. Folder Structure Rationale

```
src/
├── __docs__/           # Documentation
├── __scripts__/        # Database and utility scripts
├── __seed__/          # Test data and seeding
├── __tests__/         # Test organization
├── app/               # Application bootstrapping
│   ├── init/          # Service initialization
│   └── servers/       # Server setup (HTTP, WebSocket)
├── configs/           # Configuration management
│   ├── env.ts         # Environment variables
│   ├── logger/        # Logging configuration
│   ├── openapi/       # API documentation setup
│   └── orm/           # Database configuration
├── controllers/       # Feature-based controllers
├── domain/            # Core business logic
│   ├── _events/       # Domain events
│   ├── _mappers/      # Data transformation
│   └── [aggregates]/  # Domain aggregates
├── infrastructure/    # External concerns
│   ├── models/        # Database models
│   ├── queues/        # Message queue setup
│   └── repo/          # Repository implementations
├── library/           # Custom frameworks and utilities
├── schemas/           # Validation schemas
├── services/          # Application services
└── shared/            # Common utilities and types
```

## 6. Data Flow Architecture

### Request Lifecycle

1. **HTTP Request** → Express middleware pipeline
2. **Route Matching** → Custom framework routing
3. **Validation** → Zod schema validation
4. **Authentication** → Security middleware
5. **Controller** → Use case handler execution
6. **Domain Layer** → Business logic processing
7. **Repository** → Data persistence/retrieval
8. **Response** → Serialized and validated output

### Domain Event Flow

1. **Domain Operation** → Aggregate generates events
2. **Repository Save** → Events dispatched after persistence
3. **Event Handlers** → Async processing of side effects
4. **Message Queue** → External system notifications

## 7. Database Architecture

### Dual ORM Strategy

- **Sequelize**:
  - Complex operations
  - Migrations and schema management
  - Model definitions and relationships
- **Kysely**:
  - Type-safe query building
  - Performance-critical operations
  - Complex joins and aggregations

### Transaction Management

```typescript
async _save(agg: TestAggregate): Promise<void> {
    const transaction = await sequelize.transaction();
    try {
        // Multiple operations within transaction
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}
```

## 8. Testing Strategy

### Test Organization

```
__tests__/
├── data/              # Test data fixtures
├── e2e/               # End-to-end tests
│   ├── helper/        # Test utilities
│   ├── templates/     # Test scenarios
│   └── test/          # Test execution
└── integration/       # Integration tests
    ├── setup.ts       # Test environment setup
    └── [features]/    # Feature-specific tests
```

### Testing Approach

- **Unit Tests**: Domain logic and individual components
- **Integration Tests**: Repository and service layer interactions
- **E2E Tests**: Full application workflow testing

## 9. Error Handling Strategy

### Domain Errors

```typescript
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}
```

### Global Exception Handling

- **AllExceptionFilter**: Centralized error processing
- **Structured Error Responses**: Consistent API error format
- **Logging Integration**: Error tracking and monitoring

## 10. Security Architecture

### Authentication & Authorization

- **JWT-based Authentication**: Stateless security
- **Role-based Access Control**: Candidate/Examiner permissions
- **Request Validation**: Input sanitization and validation

### Security Middleware

- **DecoderMiddleware**: Request parsing and validation
- **Security Documents**: OpenAPI security scheme definitions

## 11. Performance Considerations

### Optimization Strategies

- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient database connections
- **Async Processing**: Non-blocking operations with message queues
- **Type Safety**: Compile-time error detection

### Monitoring & Logging

- **Structured Logging**: Winston-based logging
- **Request/Response Logging**: HTTP transaction tracking
- **Error Tracking**: Comprehensive error logging
- **Performance Metrics**: Database and application performance monitoring

## 12. Deployment Architecture

### Environment Configuration

- **Multi-environment Support**: Development, testing, production
- **Environment Variables**: Centralized configuration management
- **Database Migrations**: Automated schema updates

### Process Management

- **Graceful Startup**: Service initialization sequence
- **Error Recovery**: Robust error handling and recovery
- **Database Connectivity**: Connection validation and retry logic

## 13. Future Extensibility

### Design Patterns for Growth

- **Plugin Architecture**: Custom framework extensibility
- **Event-driven Integration**: Loose coupling through domain events
- **Repository Pattern**: Easy data layer modifications
- **Clean Architecture**: Independent business logic evolution

### Scalability Considerations

- **Message Queue Integration**: Horizontal scaling capability
- **Database Abstraction**: Multi-database support potential
- **Microservice Ready**: Domain boundaries for service extraction

This architecture documentation provides a comprehensive overview of the Thresh backend system, highlighting its sophisticated use of Domain-Driven Design principles, clean architecture patterns, and modern Node.js ecosystem tools.
