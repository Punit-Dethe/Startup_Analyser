# Requirements Document

## Introduction

This document specifies requirements for migrating the KORE dashboard backend from n8n workflows to a FastAPI-based Python backend. The current n8n implementation introduces 2-3 minute latency, making it unsuitable for production use. The new FastAPI backend will maintain the exact same API contract while providing sub-30-second response times through direct Gemini API integration.

## Glossary

- **KORE_Frontend**: The Next.js application that serves the dashboard UI
- **N8N_Backend**: The current n8n workflow-based backend (to be replaced)
- **FastAPI_Backend**: The new Python FastAPI backend being developed
- **Gemini_API**: Google's Generative AI API used for dashboard generation and chat
- **Generate_Endpoint**: The `/api/generate` endpoint that creates new dashboards
- **Chat_Endpoint**: The `/api/chat` endpoint that handles conversational interactions
- **System_Prompt**: Markdown files containing instructions for Gemini API
- **Dashboard_Payload**: JSON structure containing dashboard metadata, tabs, and modules
- **Chat_Response**: JSON structure containing action type and response data
- **API_Contract**: The request/response schema that the frontend expects

## Requirements

### Requirement 1: FastAPI Backend Foundation

**User Story:** As a developer, I want a FastAPI backend with proper project structure, so that I can maintain and deploy the application easily.

#### Acceptance Criteria

1. THE FastAPI_Backend SHALL use Python 3.11 or higher
2. THE FastAPI_Backend SHALL include a requirements.txt file with all dependencies
3. THE FastAPI_Backend SHALL include a Dockerfile for containerized deployment
4. THE FastAPI_Backend SHALL load configuration from environment variables
5. THE FastAPI_Backend SHALL include CORS middleware configured for the KORE_Frontend origin
6. THE FastAPI_Backend SHALL include error handling middleware that returns consistent error responses
7. THE FastAPI_Backend SHALL include health check endpoint at `/health`

### Requirement 2: Generate Endpoint Implementation

**User Story:** As a frontend developer, I want the `/generate` endpoint to maintain the exact same API contract, so that I don't need to modify frontend code.

#### Acceptance Criteria

1. THE Generate_Endpoint SHALL accept POST requests at `/api/generate`
2. WHEN a request contains `{"query": string}`, THE Generate_Endpoint SHALL validate the input
3. THE Generate_Endpoint SHALL load the generation System_Prompt from a markdown file
4. THE Generate_Endpoint SHALL call Gemini_API with the System_Prompt and user query
5. THE Generate_Endpoint SHALL parse the Gemini_API response as JSON
6. THE Generate_Endpoint SHALL return a response matching the GenerateResponse TypeScript interface
7. THE Generate_Endpoint SHALL include fields: `dashboard`, `dashboard_state`, and `generated_at`
8. THE Generate_Endpoint SHALL complete requests within 30 seconds
9. IF Gemini_API returns invalid JSON, THEN THE Generate_Endpoint SHALL return HTTP 500 with error details
10. IF the request is missing required fields, THEN THE Generate_Endpoint SHALL return HTTP 400 with validation errors

### Requirement 3: Chat Endpoint Implementation

**User Story:** As a frontend developer, I want the `/chat` endpoint to maintain the exact same API contract, so that chat functionality works without frontend changes.

#### Acceptance Criteria

1. THE Chat_Endpoint SHALL accept POST requests at `/api/chat`
2. WHEN a request contains `{"message": string, "history": array, "context": object}`, THE Chat_Endpoint SHALL validate all required fields
3. THE Chat_Endpoint SHALL load the chat System_Prompt from a markdown file
4. THE Chat_Endpoint SHALL format the chat history and context for Gemini_API
5. THE Chat_Endpoint SHALL call Gemini_API with the formatted prompt
6. THE Chat_Endpoint SHALL parse the Gemini_API response as JSON
7. THE Chat_Endpoint SHALL return a Chat_Response with one of three action types: CHAT, NEW_DASHBOARD, or TEMPORARY_TAB
8. WHEN action is CHAT, THE Chat_Response SHALL include a message field
9. WHEN action is NEW_DASHBOARD, THE Chat_Response SHALL include message and new_prompt fields
10. WHEN action is TEMPORARY_TAB, THE Chat_Response SHALL include message, tab, and modules fields
11. THE Chat_Endpoint SHALL complete requests within 30 seconds
12. IF Gemini_API returns invalid JSON, THEN THE Chat_Endpoint SHALL return HTTP 500 with error details

### Requirement 4: Gemini API Integration

**User Story:** As a backend developer, I want direct Gemini API integration, so that I can eliminate n8n latency overhead.

#### Acceptance Criteria

1. THE FastAPI_Backend SHALL use the google-generativeai Python SDK
2. THE FastAPI_Backend SHALL load the Gemini API key from environment variable GEMINI_API_KEY
3. THE FastAPI_Backend SHALL use the gemini-1.5-pro model
4. THE FastAPI_Backend SHALL configure JSON response mode for structured outputs
5. THE FastAPI_Backend SHALL set appropriate temperature and token limits
6. IF the Gemini API key is not configured, THEN THE FastAPI_Backend SHALL return HTTP 503 on startup
7. IF Gemini_API rate limits are exceeded, THEN THE FastAPI_Backend SHALL return HTTP 429 with retry-after header

### Requirement 5: System Prompt Management

**User Story:** As a content manager, I want system prompts stored in markdown files, so that I can update AI instructions without code changes.

#### Acceptance Criteria

1. THE FastAPI_Backend SHALL load the generation System_Prompt from `prompts/generate.md`
2. THE FastAPI_Backend SHALL load the chat System_Prompt from `prompts/chat.md`
3. THE FastAPI_Backend SHALL reload System_Prompts when files are modified
4. IF a System_Prompt file is missing, THEN THE FastAPI_Backend SHALL log an error and return HTTP 503
5. THE FastAPI_Backend SHALL preserve all markdown formatting when loading System_Prompts

### Requirement 6: Response Validation

**User Story:** As a backend developer, I want response validation, so that I can catch Gemini API output errors before they reach the frontend.

#### Acceptance Criteria

1. THE FastAPI_Backend SHALL validate that Generate_Endpoint responses contain required fields: meta, tabs, chat_intro, modules
2. THE FastAPI_Backend SHALL validate that Chat_Endpoint responses contain required field: action
3. THE FastAPI_Backend SHALL validate that all modules have required fields: id, type, size, accent, data
4. THE FastAPI_Backend SHALL validate that tab references in modules exist in the tabs array
5. IF validation fails, THEN THE FastAPI_Backend SHALL log the invalid response and return HTTP 500

### Requirement 7: Error Handling and Logging

**User Story:** As a DevOps engineer, I want comprehensive error handling and logging, so that I can diagnose production issues quickly.

#### Acceptance Criteria

1. THE FastAPI_Backend SHALL log all incoming requests with timestamp, endpoint, and request body size
2. THE FastAPI_Backend SHALL log all Gemini_API calls with model, prompt length, and response time
3. THE FastAPI_Backend SHALL log all errors with stack traces
4. THE FastAPI_Backend SHALL use structured logging in JSON format
5. THE FastAPI_Backend SHALL include request IDs in all log entries
6. WHEN an error occurs, THE FastAPI_Backend SHALL return a consistent error response with request_id and error message
7. THE FastAPI_Backend SHALL not expose internal error details in production mode

### Requirement 8: Environment Configuration

**User Story:** As a DevOps engineer, I want environment-based configuration, so that I can deploy to different environments without code changes.

#### Acceptance Criteria

1. THE FastAPI_Backend SHALL load configuration from environment variables
2. THE FastAPI_Backend SHALL support these environment variables: GEMINI_API_KEY, FRONTEND_URL, PORT, LOG_LEVEL, ENVIRONMENT
3. THE FastAPI_Backend SHALL use default values for optional configuration
4. THE FastAPI_Backend SHALL validate required environment variables on startup
5. IF required environment variables are missing, THEN THE FastAPI_Backend SHALL log an error and exit with non-zero status
6. THE FastAPI_Backend SHALL include a `.env.example` file documenting all configuration options

### Requirement 9: Deployment Configuration

**User Story:** As a DevOps engineer, I want deployment configurations for multiple platforms, so that I can deploy to Vercel, Railway, or Render.

#### Acceptance Criteria

1. THE FastAPI_Backend SHALL include a Dockerfile with multi-stage build
2. THE FastAPI_Backend SHALL include a `railway.json` configuration file
3. THE FastAPI_Backend SHALL include a `render.yaml` configuration file
4. THE FastAPI_Backend SHALL include deployment instructions in README.md
5. THE FastAPI_Backend SHALL expose the port via environment variable PORT with default 8000
6. THE FastAPI_Backend SHALL serve on 0.0.0.0 to accept external connections

### Requirement 10: Migration Strategy Support

**User Story:** As a product manager, I want to run both backends in parallel, so that I can migrate to FastAPI with zero downtime.

#### Acceptance Criteria

1. THE KORE_Frontend SHALL support environment variable BACKEND_TYPE with values: n8n or fastapi
2. WHEN BACKEND_TYPE is n8n, THE KORE_Frontend SHALL use N8N_GENERATE_WEBHOOK and N8N_CHAT_WEBHOOK
3. WHEN BACKEND_TYPE is fastapi, THE KORE_Frontend SHALL use FASTAPI_BASE_URL
4. THE KORE_Frontend SHALL maintain backward compatibility with existing n8n environment variables
5. THE FastAPI_Backend SHALL be deployable alongside the N8N_Backend without conflicts

### Requirement 11: Performance Requirements

**User Story:** As a user, I want fast dashboard generation, so that I can get insights quickly.

#### Acceptance Criteria

1. THE Generate_Endpoint SHALL complete 95% of requests within 30 seconds
2. THE Chat_Endpoint SHALL complete 95% of requests within 15 seconds
3. THE FastAPI_Backend SHALL handle at least 10 concurrent requests
4. THE FastAPI_Backend SHALL use connection pooling for Gemini_API calls
5. THE FastAPI_Backend SHALL include request timeout of 60 seconds

### Requirement 12: Security Requirements

**User Story:** As a security engineer, I want secure API key management and request validation, so that the backend is protected from attacks.

#### Acceptance Criteria

1. THE FastAPI_Backend SHALL not log API keys or sensitive data
2. THE FastAPI_Backend SHALL validate request body size limits (max 1MB)
3. THE FastAPI_Backend SHALL include rate limiting middleware
4. THE FastAPI_Backend SHALL set security headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
5. THE FastAPI_Backend SHALL validate CORS origins against allowed list
6. THE FastAPI_Backend SHALL use HTTPS in production environments
7. IF rate limits are exceeded, THEN THE FastAPI_Backend SHALL return HTTP 429

### Requirement 13: Optional Streaming Support

**User Story:** As a user, I want streaming responses for long-running generations, so that I can see progress in real-time.

#### Acceptance Criteria

1. WHERE streaming is enabled, THE Generate_Endpoint SHALL support Server-Sent Events (SSE)
2. WHERE streaming is enabled, THE Generate_Endpoint SHALL stream partial JSON updates
3. WHERE streaming is enabled, THE KORE_Frontend SHALL display loading progress
4. WHERE streaming is enabled, THE FastAPI_Backend SHALL include a `stream` query parameter

### Requirement 14: Optional Caching Layer

**User Story:** As a backend developer, I want to cache repeated queries, so that I can reduce Gemini API costs and improve response times.

#### Acceptance Criteria

1. WHERE caching is enabled, THE FastAPI_Backend SHALL cache Generate_Endpoint responses by query hash
2. WHERE caching is enabled, THE FastAPI_Backend SHALL set cache TTL to 24 hours
3. WHERE caching is enabled, THE FastAPI_Backend SHALL include cache hit/miss in response headers
4. WHERE caching is enabled, THE FastAPI_Backend SHALL support cache invalidation via admin endpoint
5. WHERE caching is enabled, THE FastAPI_Backend SHALL use Redis for distributed caching
