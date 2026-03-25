# Implementation Plan: FastAPI Backend Migration

## Overview

This implementation plan converts the FastAPI backend design into actionable coding tasks. The migration replaces the n8n workflow backend with a direct FastAPI + Gemini API integration to reduce latency from 2-3 minutes to under 30 seconds while maintaining 100% API contract compatibility with the Next.js frontend.

The implementation follows an incremental approach: project setup → core infrastructure → API endpoints → validation → testing → deployment configuration → frontend integration → migration execution.

## Tasks

- [x] 1. Set up project structure and core dependencies
  - Create fastapi-backend/ directory with proper Python package structure
  - Create requirements.txt with FastAPI, uvicorn, google-generativeai, pydantic, pytest, hypothesis
  - Create .env.example file documenting all environment variables
  - Create .gitignore for Python projects
  - Create README.md with setup instructions
  - _Requirements: 1.1, 1.2, 8.6_

- [x] 2. Implement configuration management
  - [x] 2.1 Create app/config.py with Pydantic BaseSettings
    - Load environment variables: GEMINI_API_KEY, FRONTEND_URL, PORT, LOG_LEVEL, ENVIRONMENT
    - Implement validation for required variables (GEMINI_API_KEY)
    - Set default values for optional variables (PORT=8000, LOG_LEVEL=INFO, ENVIRONMENT=development)
    - Raise error on startup if required variables missing
    - _Requirements: 1.4, 8.1, 8.2, 8.3, 8.4, 8.5_

  - [ ]* 2.2 Write property test for configuration loading
    - **Property 1: Environment Configuration Loading**
    - **Validates: Requirements 1.4, 4.2, 8.1**

- [x] 3. Implement logging infrastructure
  - [x] 3.1 Create app/utils/logging.py with structured JSON logging
    - Configure logging format with timestamp, level, request_id, endpoint
    - Implement sensitive data filtering (API keys, tokens)
    - Support log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
    - Add request ID generation and propagation
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 12.1_

  - [ ]* 3.2 Write property test for sensitive data logging prevention
    - **Property 21: Sensitive Data Logging Prevention**
    - **Validates: Requirements 12.1**

- [x] 4. Create custom exception classes
  - Create app/utils/errors.py with custom exceptions
  - Define GeminiAPIError, GeminiRateLimitError, GeminiParseError
  - Define ValidationError, ServiceError, PromptNotFoundError
  - Include request_id in all exception classes
  - _Requirements: 7.6_

- [x] 5. Implement Pydantic models for requests and responses
  - [x] 5.1 Create app/models/requests.py
    - Define GenerateRequest with query field validation (min_length=1, max_length=500)
    - Define ChatMessage with role and content fields
    - Define CompactModule with all required fields
    - Define DashboardContext with subject, active_tab, visible_modules
    - Define ChatRequest with message, history, context validation
    - _Requirements: 2.2, 3.2_

  - [x] 5.2 Create app/models/responses.py
    - Define DashboardMeta with all required fields
    - Define Tab with id, label, isTemporary
    - Define Module with id, tab, type, size, accent, data
    - Define DashboardPayload with meta, tabs, chat_intro, modules
    - Define CompactState and CompactTab for dashboard_state
    - Define GenerateResponse with dashboard, dashboard_state, generated_at
    - Define ChatResponse with action, message, new_prompt, tab, modules
    - _Requirements: 2.6, 2.7, 3.7, 3.8, 3.9, 3.10_

  - [x] 5.3 Create app/models/dashboard.py
    - Define module type-specific data structures (chart.bar, chart.line, metric.kpi, table, etc.)
    - Add validation for type-specific required fields
    - _Requirements: 6.3_

- [x] 6. Implement Gemini API client
  - [x] 6.1 Create app/integrations/gemini_client.py
    - Initialize google-generativeai SDK with API key
    - Configure gemini-1.5-pro model with JSON response mode
    - Implement generate() method with temperature, max_tokens, json_mode parameters
    - Implement JSON extraction logic (direct parse, markdown code block, regex fallback)
    - Implement retry logic with exponential backoff (max 3 retries)
    - Handle rate limit errors (429) with retry-after header
    - Handle timeout errors (55-second timeout)
    - Log all API calls with token usage tracking
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.7_

  - [ ]* 6.2 Write property test for Gemini response JSON parsing
    - **Property 5: Gemini Response JSON Parsing**
    - **Validates: Requirements 2.5, 3.6**

  - [ ]* 6.3 Write property test for rate limit error handling
    - **Property 13: Gemini Rate Limit Error Handling**
    - **Validates: Requirements 4.7**

- [x] 7. Implement system prompt management
  - [x] 7.1 Create app/services/prompt_service.py
    - Load prompts from prompts/generate.md and prompts/chat.md
    - Preserve all markdown formatting when loading
    - Handle missing prompt files with PromptNotFoundError
    - Implement prompt caching for performance
    - _Requirements: 5.1, 5.2, 5.4, 5.5_

  - [x] 7.2 Copy system prompts to prompts/ directory
    - Copy kore-frontend/N8N_GEMINI_SYSTEM_PROMPT.md to prompts/generate.md
    - Copy kore-frontend/N8N_CHAT_SYSTEM_PROMPT.md to prompts/chat.md
    - _Requirements: 5.1, 5.2_

  - [ ]* 7.3 Write property test for markdown preservation
    - **Property 14: System Prompt Markdown Preservation**
    - **Validates: Requirements 5.5**

- [x] 8. Checkpoint - Ensure core infrastructure is working
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement dashboard validation
  - [x] 9.1 Create app/validation/dashboard_validator.py
    - Validate required fields: meta, tabs, chat_intro, modules
    - Validate module required fields: id, type, size, accent, data
    - Validate module tab references exist in tabs array
    - Validate module type-specific data structures
    - Collect and return all validation errors
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 9.2 Write property test for generate response structure validation
    - **Property 6: Generate Response Structure Validation**
    - **Validates: Requirements 2.6, 2.7, 6.1**

  - [ ]* 9.3 Write property test for module required fields validation
    - **Property 16: Module Required Fields Validation**
    - **Validates: Requirements 6.3**

  - [ ]* 9.4 Write property test for module tab reference integrity
    - **Property 17: Module Tab Reference Integrity**
    - **Validates: Requirements 6.4**

- [x] 10. Implement chat response validation
  - [x] 10.1 Create app/validation/chat_validator.py
    - Validate action field is present and one of: CHAT, NEW_DASHBOARD, TEMPORARY_TAB
    - Validate CHAT action has message field
    - Validate NEW_DASHBOARD action has message and new_prompt fields
    - Validate TEMPORARY_TAB action has message, tab, and modules fields
    - _Requirements: 3.7, 3.8, 3.9, 3.10, 6.2_

  - [ ]* 10.2 Write property test for chat response action type validation
    - **Property 9: Chat Response Action Type Validation**
    - **Validates: Requirements 3.7**

  - [ ]* 10.3 Write property test for chat action field requirements
    - **Property 10, 11, 12: Chat Action Field Requirements**
    - **Validates: Requirements 3.8, 3.9, 3.10**

- [x] 11. Implement generate service
  - [x] 11.1 Create app/services/generate_service.py
    - Load system prompt from PromptService
    - Format prompt with user query
    - Call GeminiClient.generate() with retry logic
    - Parse and validate response using DashboardValidator
    - Create dashboard_state (compact summary)
    - Return GenerateResponse with dashboard, dashboard_state, generated_at
    - Handle errors and log with request context
    - _Requirements: 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 11.2 Write unit tests for generate service
    - Test successful dashboard generation
    - Test error handling for invalid Gemini responses
    - Test prompt loading and formatting

- [x] 12. Implement chat service
  - [x] 12.1 Create app/services/chat_service.py
    - Load system prompt from PromptService
    - Format conversation history for Gemini API
    - Inject dashboard context (active tab, visible modules)
    - Call GeminiClient.generate() with retry logic
    - Parse and validate response using ChatValidator
    - Return ChatResponse with appropriate action type
    - Handle errors and log with request context
    - _Requirements: 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10_

  - [ ]* 12.2 Write unit tests for chat service
    - Test conversation history formatting
    - Test dashboard context injection
    - Test all three action types (CHAT, NEW_DASHBOARD, TEMPORARY_TAB)

- [x] 13. Checkpoint - Ensure services and validation are working
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Implement FastAPI application and middleware
  - [x] 14.1 Create app/main.py with FastAPI initialization
    - Initialize FastAPI app with title, version, description
    - Configure CORS middleware with FRONTEND_URL origin
    - Add request logging middleware (log all incoming requests)
    - Add error handling middleware (catch all exceptions, return consistent error format)
    - Add security headers middleware (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
    - Add request body size validation middleware (max 1MB)
    - Add rate limiting middleware (configurable per minute)
    - _Requirements: 1.5, 1.6, 7.1, 12.2, 12.4, 12.7_

  - [ ]* 14.2 Write property test for CORS origin validation
    - **Property 2: CORS Origin Validation**
    - **Validates: Requirements 1.5, 12.5**

  - [ ]* 14.3 Write property test for security headers presence
    - **Property 23: Security Headers Presence**
    - **Validates: Requirements 12.4**

  - [ ]* 14.4 Write property test for request body size validation
    - **Property 22: Request Body Size Validation**
    - **Validates: Requirements 12.2**

- [x] 15. Implement dependency injection
  - Create app/dependencies.py
  - Define get_config() dependency
  - Define get_gemini_client() dependency
  - Define get_prompt_service() dependency
  - Define get_generate_service() dependency
  - Define get_chat_service() dependency
  - _Requirements: 1.4, 4.2_

- [x] 16. Implement health check endpoint
  - [x] 16.1 Create app/api/health.py
    - Implement GET /health endpoint
    - Return status, timestamp, version, gemini_configured
    - Return 503 if Gemini API key not configured
    - _Requirements: 1.7, 4.6_

  - [ ]* 16.2 Write unit tests for health endpoint
    - Test healthy status when configured
    - Test unhealthy status when API key missing

- [x] 17. Implement generate endpoint
  - [x] 17.1 Create app/api/generate.py
    - Implement POST /api/generate endpoint
    - Validate request body using GenerateRequest model
    - Call GenerateService.generate()
    - Return GenerateResponse (200) or error response (400/500/503)
    - Set 60-second timeout
    - Log request start/end with duration
    - _Requirements: 2.1, 2.2, 2.8, 2.9, 2.10, 11.5_

  - [ ]* 17.2 Write property test for generate request input validation
    - **Property 4: Generate Request Input Validation**
    - **Validates: Requirements 2.2, 2.10**

  - [ ]* 17.3 Write property test for invalid JSON error handling
    - **Property 7: Invalid JSON Error Handling**
    - **Validates: Requirements 2.9, 3.12**

  - [ ]* 17.4 Write unit tests for generate endpoint
    - Test successful dashboard generation
    - Test missing query field (400)
    - Test Gemini API error (500)
    - Test timeout (504)

- [x] 18. Implement chat endpoint
  - [x] 18.1 Create app/api/chat.py
    - Implement POST /api/chat endpoint
    - Validate request body using ChatRequest model
    - Call ChatService.chat()
    - Return ChatResponse (200) or error response (400/500/503)
    - Set 60-second timeout
    - Log request start/end with duration
    - _Requirements: 3.1, 3.2, 3.11, 3.12_

  - [ ]* 18.2 Write property test for chat request input validation
    - **Property 8: Chat Request Input Validation**
    - **Validates: Requirements 3.2**

  - [ ]* 18.3 Write unit tests for chat endpoint
    - Test all three action types
    - Test missing required fields (400)
    - Test invalid action type
    - Test Gemini API error (500)

- [x] 19. Wire all endpoints to main application
  - Register health, generate, and chat routers in app/main.py
  - Verify all routes are accessible
  - Test end-to-end flow locally
  - _Requirements: 1.7, 2.1, 3.1_

- [x] 20. Checkpoint - Ensure all endpoints are working
  - Ensure all tests pass, ask the user if questions arise.

- [x] 21. Implement error response consistency
  - [x] 21.1 Update error handling middleware to return consistent format
    - All errors return {error, request_id, details}
    - Production mode hides internal details
    - Development mode includes stack traces
    - _Requirements: 1.6, 7.6, 7.7_

  - [ ]* 21.2 Write property test for consistent error response format
    - **Property 3: Consistent Error Response Format**
    - **Validates: Requirements 1.6, 7.6**

  - [ ]* 21.3 Write property test for production error detail sanitization
    - **Property 19: Production Error Detail Sanitization**
    - **Validates: Requirements 7.7**

- [x] 22. Create Dockerfile for containerized deployment
  - Create multi-stage Dockerfile (builder + runtime)
  - Install dependencies in builder stage
  - Copy app/ and prompts/ to runtime stage
  - Set environment variables (PORT=8000, PYTHONUNBUFFERED=1)
  - Add health check command
  - Set CMD to run uvicorn
  - _Requirements: 1.3, 9.1, 9.5_

- [x] 23. Create Railway deployment configuration
  - Create railway.json with build and deploy settings
  - Configure Dockerfile builder
  - Set start command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
  - Configure health check path and timeout
  - Set restart policy
  - _Requirements: 9.2, 9.5, 9.6_

- [x] 24. Create Render deployment configuration
  - Create render.yaml with service configuration
  - Set Python version to 3.11
  - Configure build and start commands
  - Set health check path
  - Document required environment variables
  - _Requirements: 9.3, 9.5, 9.6_

- [x] 25. Update README with deployment instructions
  - Document local development setup
  - Document Docker build and run
  - Document Railway deployment steps
  - Document Render deployment steps
  - Document environment variable configuration
  - Document testing instructions
  - _Requirements: 9.4_

- [x] 26. Checkpoint - Ensure deployment configurations are valid
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 27. Implement frontend backend switching logic
  - [ ] 27.1 Update kore-frontend/.env.local
    - Add BACKEND_TYPE=n8n (default to n8n for safety)
    - Add FASTAPI_BASE_URL=http://localhost:8000 (for local testing)
    - Keep existing N8N_GENERATE_WEBHOOK and N8N_CHAT_WEBHOOK
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ] 27.2 Update kore-frontend/src/lib/api.ts
    - Read BACKEND_TYPE environment variable
    - Switch generateDashboard() URL based on BACKEND_TYPE
    - Switch chat() URL based on BACKEND_TYPE
    - Maintain backward compatibility with n8n
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ]* 27.3 Test frontend with both backends
    - Test generate endpoint with n8n backend
    - Test generate endpoint with FastAPI backend
    - Test chat endpoint with n8n backend
    - Test chat endpoint with FastAPI backend
    - Verify API contract compatibility

- [ ] 28. Deploy FastAPI backend to Railway or Render
  - Connect GitHub repository to deployment platform
  - Set environment variables (GEMINI_API_KEY, FRONTEND_URL)
  - Deploy and verify health endpoint
  - Test generate and chat endpoints with real Gemini API
  - Monitor logs for errors
  - _Requirements: 9.1, 9.2, 9.3, 9.5, 9.6_

- [ ] 29. Execute migration Phase 1: Parallel deployment
  - Verify FastAPI backend is healthy and responding
  - Test generate endpoint returns valid dashboards
  - Test chat endpoint handles conversations
  - Verify response times < 30 seconds
  - Keep n8n backend running
  - _Requirements: 10.5_

- [ ] 30. Execute migration Phase 2: Frontend feature flag testing
  - Set BACKEND_TYPE=fastapi in frontend environment
  - Deploy frontend with feature flag
  - Test all functionality with FastAPI backend
  - Verify zero frontend code changes needed
  - Test rollback by setting BACKEND_TYPE=n8n
  - _Requirements: 10.1, 10.2, 10.3, 10.4_

- [ ] 31. Execute migration Phase 3: Gradual rollout
  - Start with 10% traffic to FastAPI (internal testing)
  - Monitor error rates and response times
  - Increase to 25% traffic (early adopters)
  - Compare metrics: n8n vs FastAPI
  - Increase to 50% traffic
  - Increase to 100% traffic if metrics are good
  - Keep n8n running for rollback capability
  - _Requirements: 11.1, 11.2, 11.3_

- [ ] 32. Execute migration Phase 4: n8n deprecation
  - Verify 100% traffic on FastAPI for 7 days
  - Confirm zero user-reported issues
  - Confirm response times consistently < 30 seconds
  - Remove n8n environment variables from frontend
  - Archive n8n workflows for reference
  - Shut down n8n instance
  - _Requirements: 10.5_

- [ ] 33. Final checkpoint - Migration complete
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and integration points
- Migration is executed in phases with rollback capability at each step
- The implementation maintains 100% API contract compatibility with the frontend
