# Thresh - Backend Functionality Documentation

## Overview

Thresh provides a comprehensive set of RESTful APIs for managing online examinations and practice tests. The system supports both practice tests (self-paced learning) and formal exams (timed, controlled environments) with real-time features and automated evaluation capabilities.

## Core Functional Modules

### 1. Templates Management (`/api/templates`)

**Purpose**: Manage reusable test templates for quick test creation

#### Endpoints:

- **GET `/templates`** - Retrieve all templates with filtering and pagination
- **GET `/templates/:templateId`** - Get specific template details
- **POST `/templates`** - Create new template
- **PUT `/templates/:templateId`** - Update existing template
- **DELETE `/templates/:templateId`** - Delete template

#### Key Features:

- **Template Creation**: Define reusable test structures with metadata
- **Search & Filtering**: Filter by tags, difficulty, creation date
- **Template Management**: Full CRUD operations for template lifecycle
- **Pagination**: Efficient data retrieval with sorting options

#### Template Properties:

```typescript
{
  id: string,
  userId: string,
  name: string,
  title: string,
  description: string,
  language: string,
  minutesToAnswer: number,
  difficulty: string,
  tags: string[],
  numberOfQuestions: number,
  numberOfOptions: number,
  outlines: string[],
  timestamps: { createdAt, updatedAt }
}
```

---

### 2. Tests Management (`/api/tests`)

**Purpose**: Core test/exam creation, management, and administration

#### Test Lifecycle Endpoints:

- **GET `/tests`** - List all tests with filtering
- **GET `/tests/find-by-room`** - Find test by room ID (for exam participation)
- **GET `/tests/:testId`** - Get detailed test information
- **POST `/tests`** - Create new test (practice or exam)
- **PUT `/tests/:testId`** - Update test configuration
- **DELETE `/tests/:testId`** - Delete test and all associated data

#### Test Content & Structure:

- **GET `/tests/:testId/questions`** - Retrieve test questions
- **GET `/tests/:testId/attempts`** - Get all attempts for a test
- **GET `/tests/:testId/participants`** - List exam participants

#### Exam Participant Management:

- **POST `/tests/:testId/participants`** - Add participant to exam
- **DELETE `/tests/:testId/participants`** - Remove participant from exam

#### Key Features:

##### Test Types:

1. **Practice Tests**:

   - Self-paced learning
   - Unlimited attempts
   - Immediate feedback
   - Configurable difficulty and tags

2. **Formal Exams**:
   - Time-bounded sessions
   - Limited attempts per participant
   - Room-based access control
   - Participant management
   - Password protection
   - Scheduled open/close dates

##### Question Types:

- **Multiple Choice Questions (MCQ)**:
  - Configurable options
  - Single correct answer
  - Automatic scoring
- **Long Answer Questions**:
  - Text-based responses
  - Manual or AI-assisted evaluation
  - Support for images and extra content

##### Test Configuration:

- Duration limits (minutes to answer)
- Language settings
- Visibility controls (answer visibility, results sharing)
- Access controls (public/private, password protection)

---

### 3. Attempts Management (`/api/attempts`)

**Purpose**: Handle test execution, answer submission, and attempt lifecycle

#### Attempt Lifecycle:

- **GET `/attempts`** - List user's attempts with filtering
- **GET `/attempts/:attemptId`** - Get specific attempt details
- **POST `/attempts`** - Start new test attempt
- **GET `/attempts/:attemptId/answers`** - Retrieve attempt answers
- **POST `/attempts/:attemptId/answers`** - Submit/update answers
- **PATCH `/attempts/:attemptId/submit`** - Submit completed attempt

#### Key Features:

##### Attempt Management:

- **Attempt Creation**: Initialize new test sessions
- **Progress Tracking**: Real-time attempt status monitoring
- **Answer Persistence**: Incremental answer saving
- **Time Management**: Duration tracking and timeout handling
- **Submission Control**: Explicit submission vs. auto-timeout

##### Answer Handling:

- **Incremental Submission**: Save answers as user progresses
- **Answer Validation**: Type-specific validation (MCQ/Long Answer)
- **Answer Retrieval**: Get current attempt state
- **Answer Modification**: Update answers before final submission

##### Attempt States:

- `IN_PROGRESS`: Active attempt in session
- `COMPLETED`: Successfully submitted
- `TIMED_OUT`: Automatically ended due to time limit

##### Scheduling Features:

- **Ongoing Attempt Monitoring**: Background service tracks active attempts
- **Automatic Timeout**: System automatically ends attempts when time expires
- **Grace Period Handling**: Configurable submission grace periods

---

### 4. Candidates Management (`/api/candidates`)

**Purpose**: User activity tracking and attempt history

#### Endpoints:

- **GET `/candidates/:candidateId/attempts`** - Get candidate's attempt history

#### Key Features:

- **Attempt History**: Complete record of user's test attempts
- **Performance Tracking**: Historical performance analysis
- **Progress Monitoring**: Track learning progress over time
- **Statistical Insights**: Attempt patterns and success rates

---

### 5. Feedback System (`/api/feedbacks`)

**Purpose**: Collect and manage user feedback on tests and system experience

#### Endpoints:

- **GET `/feedbacks`** - Retrieve feedback with filtering
- **GET `/feedbacks/:feedbackId`** - Get specific feedback
- **POST `/feedbacks`** - Submit new feedback
- **PUT `/feedbacks/:feedbackId`** - Update feedback
- **DELETE `/feedbacks/:feedbackId`** - Delete feedback

#### Key Features:

##### Feedback Collection:

- **Rating System**: 1-10 scale rating
- **Problem Categories**: Predefined issue types
- **Comment System**: Free-text feedback
- **Test Association**: Link feedback to specific tests

##### Feedback Analysis:

- **Rating Analytics**: Average ratings and trends
- **Problem Identification**: Common issues tracking
- **Temporal Analysis**: Feedback over time
- **Test-specific Insights**: Per-test feedback aggregation

##### Feedback Properties:

```typescript
{
  id: string,
  testId: string,
  rating: number, // 1-10
  problems: FeedbackProblem[], // Predefined categories
  comment?: string,
  timestamps: { createdAt, updatedAt }
}
```

---

## Cross-Cutting Features

### Authentication & Authorization

- **JWT-based Authentication**: Stateless security model
- **Role-based Access**: Candidate vs. Examiner permissions
- **Resource Ownership**: Users can only access their own data
- **Exam Participation**: Password-protected exam access

### Real-time Features

- **Socket.IO Integration**: Real-time communication
- **Attempt Monitoring**: Live attempt status updates
- **Automatic Timeouts**: Background scheduling system
- **Real-time Notifications**: System-wide event broadcasting

### Data Management

- **Pagination**: Efficient large dataset handling
- **Sorting**: Multiple field sorting options
- **Filtering**: Advanced filtering capabilities
- **Search**: Text-based search across resources

### Validation & Type Safety

- **Zod Schema Validation**: Runtime type checking
- **OpenAPI Documentation**: Auto-generated API docs
- **Request/Response Validation**: Comprehensive data validation
- **Type-safe Operations**: TypeScript throughout the stack

### Performance & Reliability

- **Transaction Management**: ACID compliance for data operations
- **Error Handling**: Comprehensive error management
- **Logging**: Structured logging for monitoring
- **Background Processing**: Async operations via message queues

## Business Workflows

### 1. Practice Test Workflow

1. **Template Selection**: Choose or create test template
2. **Test Creation**: Configure practice test from template
3. **Attempt Initiation**: Student starts practice session
4. **Progressive Answering**: Submit answers incrementally
5. **Immediate Feedback**: Get results upon completion
6. **Performance Review**: Analyze results and learn from mistakes

### 2. Formal Exam Workflow

1. **Exam Setup**: Create exam with participants, timing, and access controls
2. **Participant Enrollment**: Add candidates to exam (with password if required)
3. **Exam Session**:
   - Students join via room ID/password
   - Time-bounded attempt execution
   - Automatic timeout handling
4. **Answer Collection**: Incremental and final submission
5. **Results Processing**: Automated scoring and manual evaluation
6. **Results Distribution**: Controlled access to results based on configuration

### 3. Content Management Workflow

1. **Template Creation**: Define reusable test structures
2. **Question Bank Management**: Create and organize questions
3. **Test Assembly**: Combine templates and questions into tests
4. **Review & Validation**: Test configuration validation
5. **Publication**: Make tests available to candidates

### 4. Feedback Loop Workflow

1. **Test Completion**: Candidate completes test/exam
2. **Feedback Collection**: System prompts for feedback
3. **Data Analysis**: Aggregate feedback for insights
4. **Continuous Improvement**: Use feedback to enhance tests and system

## Technical Capabilities

### Scalability Features

- **Async Processing**: Message queue integration for heavy operations
- **Database Optimization**: Dual ORM strategy for performance
- **Caching Strategy**: Efficient data retrieval patterns
- **Background Jobs**: Scheduled task processing

### Integration Capabilities

- **Message Broker**: RabbitMQ for async communication
- **Protocol Buffers**: Efficient data serialization
- **OpenAPI**: Standardized API documentation
- **WebSocket**: Real-time bidirectional communication

### Quality Assurance

- **Comprehensive Testing**: Unit, integration, and E2E tests
- **Type Safety**: Full TypeScript implementation
- **Data Integrity**: Transaction-based operations
- **Error Recovery**: Robust error handling and logging

This functionality documentation provides a complete overview of the Thresh backend capabilities, from basic CRUD operations to complex examination workflows and real-time features.
