# Design Document: FastAPI Backend Migration

## Overview

This design document specifies the architecture and implementation approach for migrating the KORE dashboard backend from n8n workflows to a FastAPI-based Python backend. The migration addresses critical performance issues (2-3 minute latency) while maintaining 100% API contract compatibility with the existing Next.js frontend.

### Design Goals

1. **Performance**: Reduce response times from 2-3 minutes to under 30 seconds
2. **Compatibility**: Maintain exact API contract - zero frontend changes required
3. **Maintainability**: Clean Python codebase with proper structure and testing
4. **Deployability**: Support multiple deployment platforms (Vercel, Railway, Render)
5. **Observability**: Comprehensive logging and error handling for production debugging

### Key Design Decisions

**Why FastAPI?**
- Native async/await support for concurrent Gemini API calls
- Automatic OpenAPI documentation generation
- Built-in request/response validation with Pydantic
- Excellent performance characteristics (comparable to Node.js)
- Strong typing support for maintainability

**Why Direct Gemini Integration?**
- Eliminates n8n webhook overhead (500-800ms per hop)
- Removes network latency between n8n nodes
- Enables better error handling and retry logic
- Simplifies deployment (single service vs n8n + workflows)

**Migration Strategy**
- Parallel deployment: Both backends run simultaneously
- Frontend feature flag switches between backends
- Gradual rollout with monitoring
- Zero downtime migration

---

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        KORE Frontend (Next.js)                   │
│                                                                   │
│  ┌──────────────────┐              ┌──────────────────┐         │
│  │  /api/generate   │              │   /api/chat      │         │
│  │  (Next.js Route) │              │  (Next.js Route) │         │
│  └────────┬─────────┘              └────────┬─────────┘         │
│           │                                  │                   │
└───────────┼──────────────────────────────────┼───────────────────┘
            │                                  │
            │ HTTP POST                        │ HTTP POST
            │ {query: string}                  │ {message, history, context}
            │                                  │
            ▼                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FastAPI Backend (Python)                      │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────────┤
│  │  API Layer (FastAPI Routes)                                  │
│  │  - POST /api/generate                                        │
│  │  - POST /api/chat                                            │
│  │  - GET /health                                               │
│  └──────────────────┬───────────────────────────────────────────┤
│                     │                                            │
│  ┌──────────────────▼───────────────────────────────────────────┤
│  │  Service Layer                                               │
│  │  - GenerateService: Dashboard generation logic               │
│  │  - ChatService: Conversational interaction logic             │
│  │  - PromptService: System prompt loading & management         │
│  └──────────────────┬───────────────────────────────────────────┤
│                     │                                            │
│  ┌──────────────────▼───────────────────────────────────────────┤
│  │  Gemini Integration Layer                                    │
│  │  - GeminiClient: API wrapper with retry logic                │
│  │  - Response parsing & validation                             │
│  │  - JSON mode configuration                                   │
│  └──────────────────┬───────────────────────────────────────────┤
│                     │                                            │
│  ┌──────────────────▼───────────────────────────────────────────┤
│  │  Validation Layer                                            │
│  │  - Request validation (Pydantic models)                      │
│  │  - Response validation (dashboard structure)                 │
│  │  - Error handling & logging                                  │
│  └──────────────────────────────────────────────────────────────┤
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ HTTPS
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Google Gemini API                             │
│                    (gemini-1.5-pro model)                        │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

**API Layer**
- HTTP request/response handling
- CORS configuration
- Request validation
- Error response formatting
- Request ID generation and propagation

**Service Layer**
- Business logic orchestration
- System prompt loading and formatting
- Request/response transformation
- Caching logic (optional feature)

**Gemini Integration Layer**
- Direct API communication
- Retry logic with exponential backoff
- Rate limit handling
- Response parsing (JSON extraction)
- Token usage tracking

**Validation Layer**
- Pydantic models for type safety
- Dashboard structure validation
- Module reference validation
- Error collection and reporting

### Data Flow: Generate Endpoint

```
1. Frontend sends POST /api/generate
   └─> {query: "Analyze Apple"}

2. FastAPI receives request
   └─> Validates request body
   └─> Generates request_id
   └─> Logs incoming request

3. GenerateService.generate()
   └─> Loads system prompt from prompts/generate.md
   └─> Formats prompt with user query
   └─> Calls GeminiClient.generate()

4. GeminiClient.generate()
   └─> Configures Gemini API (JSON mode, temperature, tokens)
   └─> Sends request to Gemini API
   └─> Waits for response (streaming or complete)
   └─> Extracts JSON from response

5. Response Validation
   └─> Validates dashboard structure
   └─> Checks required fields (meta, tabs, modules)
   └─> Validates module references
   └─> Logs validation results

6. Response Transformation
   └─> Wraps dashboard in GenerateResponse envelope
   └─> Adds dashboard_state (compact summary)
   └─> Adds generated_at timestamp
   └─> Returns to frontend

Total time: 15-30 seconds (vs 2-3 minutes with n8n)
```

### Data Flow: Chat Endpoint

```
1. Frontend sends POST /api/chat
   └─> {message: "Why did revenue drop?", history: [...], context: {...}}

2. FastAPI receives request
   └─> Validates all required fields
   └─> Generates request_id
   └─> Logs incoming request

3. ChatService.chat()
   └─> Loads system prompt from prompts/chat.md
   └─> Formats conversation history
   └─> Injects dashboard context (active tab, visible modules)
   └─> Calls GeminiClient.generate()

4. GeminiClient.generate()
   └─> Sends formatted prompt to Gemini API
   └─> Receives JSON response with action type

5. Response Validation
   └─> Validates action type (CHAT | NEW_DASHBOARD | TEMPORARY_TAB)
   └─> Validates action-specific fields
   └─> For TEMPORARY_TAB: validates 25-cell grid rule
   └─> Logs validation results

6. Response Return
   └─> Returns ChatResponse to frontend
   └─> Frontend handles action appropriately

Total time: 10-20 seconds
```

---

## Project Structure

```
fastapi-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI app initialization, middleware, CORS
│   ├── config.py                  # Environment configuration (Pydantic Settings)
│   ├── dependencies.py            # Dependency injection (Gemini client, services)
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── generate.py            # POST /api/generate endpoint
│   │   ├── chat.py                # POST /api/chat endpoint
│   │   └── health.py              # GET /health endpoint
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── generate_service.py    # Dashboard generation business logic
│   │   ├── chat_service.py        # Chat interaction business logic
│   │   └── prompt_service.py      # System prompt loading & management
│   │
│   ├── integrations/
│   │   ├── __init__.py
│   │   └── gemini_client.py       # Gemini API wrapper with retry logic
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── requests.py            # Pydantic request models
│   │   ├── responses.py           # Pydantic response models
│   │   └── dashboard.py           # Dashboard structure models
│   │
│   ├── validation/
│   │   ├── __init__.py
│   │   ├── dashboard_validator.py # Dashboard structure validation
│   │   └── chat_validator.py      # Chat response validation
│   │
│   └── utils/
│       ├── __init__.py
│       ├── logging.py             # Structured logging setup
│       └── errors.py              # Custom exception classes
│
├── prompts/
│   ├── generate.md                # System prompt for dashboard generation
│   └── chat.md                    # System prompt for chat interactions
│
├── tests/
│   ├── __init__.py
│   ├── test_generate.py           # Generate endpoint tests
│   ├── test_chat.py               # Chat endpoint tests
│   ├── test_gemini_client.py      # Gemini integration tests
│   └── test_validation.py         # Validation logic tests
│
├── .env.example                   # Environment variable template
├── .gitignore
├── Dockerfile                     # Multi-stage Docker build
├── requirements.txt               # Python dependencies
├── railway.json                   # Railway deployment config
├── render.yaml                    # Render deployment config
└── README.md                      # Setup and deployment instructions
```

### File Responsibilities

**app/main.py**
- FastAPI app initialization
- CORS middleware configuration
- Error handling middleware
- Request logging middleware
- Health check endpoint registration
- API route registration

**app/config.py**
- Environment variable loading (Pydantic BaseSettings)
- Configuration validation on startup
- Default values for optional settings
- Type-safe configuration access

**app/api/generate.py**
- POST /api/generate route handler
- Request validation (GenerateRequest model)
- Service orchestration (GenerateService)
- Response formatting (GenerateResponse model)
- Error handling and logging

**app/api/chat.py**
- POST /api/chat route handler
- Request validation (ChatRequest model)
- Service orchestration (ChatService)
- Response formatting (ChatResponse model)
- Error handling and logging

**app/services/generate_service.py**
- Dashboard generation orchestration
- System prompt loading and formatting
- Gemini API call coordination
- Response validation
- Dashboard state summarization

**app/services/chat_service.py**
- Chat interaction orchestration
- Conversation history formatting
- Dashboard context injection
- Gemini API call coordination
- Response validation

**app/services/prompt_service.py**
- System prompt file loading
- File watching for hot reload (optional)
- Prompt caching
- Error handling for missing prompts

**app/integrations/gemini_client.py**
- Gemini API wrapper
- Retry logic with exponential backoff
- Rate limit handling (429 responses)
- JSON mode configuration
- Response parsing and error handling

**app/validation/dashboard_validator.py**
- Dashboard structure validation
- Required field checking (meta, tabs, modules)
- Module reference validation (tab IDs exist)
- Module data validation
- Error collection and reporting

---

## API Design

### Endpoint Specifications

#### POST /api/generate

**Purpose**: Generate a complete dashboard from a user query

**Request**
```typescript
{
  query: string  // User's natural language query
}
```

**Response** (Success - 200)
```typescript
{
  dashboard: {
    meta: {
      subject: string
      mode: "company" | "startup" | "market"
      brand_color: string  // Hex color
      colors?: Record<string, string>
      logo_initials: string
      page_title: string
      page_subtitle: string
    }
    tabs: Array<{
      id: string
      label: string
      isTemporary?: boolean
    }>
    chat_intro: string  // Markdown-formatted executive summary
    modules: Array<{
      id: string
      tab?: string
      type: string
      size: string
      accent: string
      data: Record<string, any>
    }>
  }
  dashboard_state: {
    subject: string
    mode: string
    tabs: Array<{
      id: string
      label: string
      module_count: number
      modules: Array<{
        id: string
        type: string
        size: string
        title: string | null
        accent: string
        value: string | number | null
      }>
    }>
  }
  generated_at: string  // ISO 8601 timestamp
}
```

**Response** (Error - 400)
```typescript
{
  error: string
  request_id: string
  details?: Record<string, any>
}
```

**Response** (Error - 500)
```typescript
{
  error: string
  request_id: string
  details?: Record<string, any>
}
```

**Response** (Error - 503)
```typescript
{
  error: "Gemini API key not configured"
  request_id: string
}
```

**Performance Requirements**
- P95 latency: < 30 seconds
- P99 latency: < 45 seconds
- Timeout: 60 seconds

#### POST /api/chat

**Purpose**: Handle conversational interactions with the dashboard

**Request**
```typescript
{
  message: string
  history: Array<{
    role: "user" | "assistant"
    content: string
  }>
  context: {
    subject: string
    active_tab: string
    visible_modules: Array<{
      id: string
      type: string
      size: string
      title: string | null
      accent: string
      value: string | number | null
    }>
  }
}
```

**Response** (Success - 200)

Action: CHAT
```typescript
{
  action: "CHAT"
  message: string  // Markdown-formatted response
  new_prompt: null
}
```

Action: NEW_DASHBOARD
```typescript
{
  action: "NEW_DASHBOARD"
  message: string
  new_prompt: string  // Prompt for new dashboard generation
}
```

Action: TEMPORARY_TAB
```typescript
{
  action: "TEMPORARY_TAB"
  message: string  // Detailed analysis
  tab: {
    id: string
    label: string
    isTemporary: true
  }
  modules: Array<{
    id: string
    tab: string
    type: string
    size: string
    accent: string
    data: Record<string, any>
  }>
}
```

**Response** (Error - 400/500/503)
Same error format as /api/generate

**Performance Requirements**
- P95 latency: < 15 seconds
- P99 latency: < 25 seconds
- Timeout: 60 seconds

#### GET /health

**Purpose**: Health check for monitoring and load balancers

**Response** (Success - 200)
```typescript
{
  status: "healthy"
  timestamp: string  // ISO 8601
  version: string
  gemini_configured: boolean
}
```

**Response** (Error - 503)
```typescript
{
  status: "unhealthy"
  timestamp: string
  error: string
}
```

---

## Components and Interfaces

### Core Classes

#### GeminiClient

```python
class GeminiClient:
    """Wrapper for Google Gemini API with retry logic and error handling."""
    
    def __init__(self, api_key: str, model: str = "gemini-1.5-pro"):
        """Initialize Gemini client with API key and model selection."""
        
    async def generate(
        self,
        prompt: str,
        system_prompt: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 8192,
        json_mode: bool = True
    ) -> dict:
        """
        Generate response from Gemini API.
        
        Args:
            prompt: User prompt
            system_prompt: System instructions
            temperature: Sampling temperature (0.0-1.0)
            max_tokens: Maximum response tokens
            json_mode: Enable JSON response mode
            
        Returns:
            Parsed JSON response
            
        Raises:
            GeminiAPIError: API request failed
            GeminiRateLimitError: Rate limit exceeded
            GeminiParseError: Failed to parse JSON response
        """
        
    async def generate_with_retry(
        self,
        prompt: str,
        max_retries: int = 3,
        **kwargs
    ) -> dict:
        """Generate with exponential backoff retry logic."""
```

#### GenerateService

```python
class GenerateService:
    """Service for dashboard generation orchestration."""
    
    def __init__(
        self,
        gemini_client: GeminiClient,
        prompt_service: PromptService,
        validator: DashboardValidator
    ):
        """Initialize with dependencies."""
        
    async def generate(self, query: str) -> GenerateResponse:
        """
        Generate complete dashboard from user query.
        
        Args:
            query: User's natural language query
            
        Returns:
            GenerateResponse with dashboard and metadata
            
        Raises:
            ValidationError: Dashboard validation failed
            ServiceError: Generation failed
        """
```

#### ChatService

```python
class ChatService:
    """Service for chat interaction orchestration."""
    
    def __init__(
        self,
        gemini_client: GeminiClient,
        prompt_service: PromptService,
        validator: ChatValidator
    ):
        """Initialize with dependencies."""
        
    async def chat(
        self,
        message: str,
        history: list[ChatMessage],
        context: DashboardContext
    ) -> ChatResponse:
        """
        Process chat message and generate response.
        
        Args:
            message: User's message
            history: Conversation history
            context: Current dashboard context
            
        Returns:
            ChatResponse with action and data
            
        Raises:
            ValidationError: Response validation failed
            ServiceError: Chat processing failed
        """
```

#### PromptService

```python
class PromptService:
    """Service for system prompt management."""
    
    def __init__(self, prompts_dir: Path):
        """Initialize with prompts directory path."""
        
    def load_prompt(self, name: str) -> str:
        """
        Load system prompt from markdown file.
        
        Args:
            name: Prompt name (e.g., "generate", "chat")
            
        Returns:
            Prompt content as string
            
        Raises:
            PromptNotFoundError: Prompt file doesn't exist
        """
        
    def reload_prompts(self):
        """Reload all prompts from disk (for hot reload)."""
```

### Pydantic Models

#### Request Models

```python
class GenerateRequest(BaseModel):
    """Request model for /api/generate endpoint."""
    query: str = Field(..., min_length=1, max_length=500)

class ChatMessage(BaseModel):
    """Single message in chat history."""
    role: Literal["user", "assistant"]
    content: str

class CompactModule(BaseModel):
    """Compact module summary for chat context."""
    id: str
    type: str
    size: str
    title: str | None
    accent: str
    value: str | int | None

class DashboardContext(BaseModel):
    """Dashboard context for chat requests."""
    subject: str
    active_tab: str
    visible_modules: list[CompactModule]

class ChatRequest(BaseModel):
    """Request model for /api/chat endpoint."""
    message: str = Field(..., min_length=1, max_length=1000)
    history: list[ChatMessage] = Field(default_factory=list)
    context: DashboardContext
```

#### Response Models

```python
class DashboardMeta(BaseModel):
    """Dashboard metadata."""
    subject: str
    mode: Literal["company", "startup", "market"]
    brand_color: str
    colors: dict[str, str] | None = None
    logo_initials: str
    page_title: str
    page_subtitle: str

class Tab(BaseModel):
    """Dashboard tab."""
    id: str
    label: str
    isTemporary: bool = False

class Module(BaseModel):
    """Dashboard module."""
    id: str
    tab: str | None = None
    type: str
    size: str
    accent: str
    data: dict[str, Any]

class DashboardPayload(BaseModel):
    """Complete dashboard structure."""
    meta: DashboardMeta
    tabs: list[Tab]
    chat_intro: str
    modules: list[Module]

class CompactTab(BaseModel):
    """Compact tab summary."""
    id: str
    label: str
    module_count: int
    modules: list[CompactModule]

class CompactState(BaseModel):
    """Compact dashboard state."""
    subject: str
    mode: str
    tabs: list[CompactTab]

class GenerateResponse(BaseModel):
    """Response model for /api/generate endpoint."""
    dashboard: DashboardPayload
    dashboard_state: CompactState
    generated_at: str

class ChatResponse(BaseModel):
    """Response model for /api/chat endpoint."""
    action: Literal["CHAT", "NEW_DASHBOARD", "TEMPORARY_TAB"]
    message: str | None = None
    new_prompt: str | None = None
    tab: Tab | None = None
    modules: list[Module] | None = None
```

---

## Data Models

### Dashboard Structure

The dashboard data model is defined by the frontend TypeScript interfaces and must be exactly replicated in Python Pydantic models for validation.

**Key Relationships**
- Dashboard contains Meta + Tabs + Modules
- Each Module references a Tab by ID
- Modules contain type-specific data structures
- Chat context contains compact module summaries

**Validation Rules**
1. All module tab references must exist in tabs array
2. Module IDs must be unique within dashboard
3. Tab IDs must be unique within dashboard
4. Module sizes must match valid format (e.g., "2x2", "3x1")
5. Accent colors must be from valid set
6. Required fields must be present based on module type

### Module Data Structures

Different module types require different data structures. The validator must check type-specific requirements:

**chart.bar, chart.line, chart.area**
```python
{
    "title": str,
    "subtitle": str | None,
    "labels": list[str],  # Must match series length
    "series": list[float]  # Must match labels length
}
```

**chart.grouped**
```python
{
    "title": str,
    "subtitle": str | None,
    "labels": list[str],
    "series_list": list[{
        "name": str,
        "values": list[float]  # Must match labels length
    }]
}
```

**chart.pie, chart.donut**
```python
{
    "title": str,
    "subtitle": str | None,
    "segments": list[{
        "label": str,
        "value": float,
        "color_key": str  # Must be valid accent color
    }]
}
```

**metric.kpi**
```python
{
    "title": str,
    "value": str | float,
    "delta": str | None,
    "direction": "up" | "down" | "neutral" | None,
    "sparkline": list[float] | None
}
```

**table**
```python
{
    "title": str,
    "subtitle": str | None,
    "columns": list[{
        "key": str,
        "label": str
    }],
    "rows": list[dict[str, Any]]  # Keys must match column keys
}
```

---

## Gemini Integration

### API Configuration

**Model Selection**: `gemini-1.5-pro`
- Reasoning: Best balance of quality and speed for structured outputs
- Alternative: `gemini-1.5-flash` for faster responses (optional feature flag)

**Generation Config**
```python
generation_config = {
    "temperature": 0.7,  # Balanced creativity/consistency
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,  # Sufficient for large dashboards
    "response_mime_type": "application/json"  # JSON mode
}
```

**Safety Settings**
```python
safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_NONE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_NONE"
    }
]
```

### Prompt Formatting

**Generate Endpoint Prompt Structure**
```
System Prompt: [Full content from prompts/generate.md]

User Query: {user_query}
```

**Chat Endpoint Prompt Structure**
```
System Prompt: [Full content from prompts/chat.md]

Dashboard Context:
Subject: {context.subject}
Active Tab: {context.active_tab}
Visible Modules:
{formatted_module_list}

Conversation History:
{formatted_history}

User Message: {user_message}
```

### Response Parsing

**JSON Extraction Strategy**
1. Check if response is valid JSON
2. If not, attempt to extract JSON from markdown code blocks
3. If not, attempt to find JSON object in text (regex)
4. If all fail, raise GeminiParseError

```python
def extract_json(response_text: str) -> dict:
    """Extract JSON from Gemini response."""
    # Try direct parse
    try:
        return json.loads(response_text)
    except json.JSONDecodeError:
        pass
    
    # Try markdown code block extraction
    json_match = re.search(r'```json\s*(\{.*?\})\s*```', response_text, re.DOTALL)
    if json_match:
        return json.loads(json_match.group(1))
    
    # Try finding JSON object
    json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
    if json_match:
        return json.loads(json_match.group(0))
    
    raise GeminiParseError("No valid JSON found in response")
```

### Error Handling

**Retry Logic**
```python
async def generate_with_retry(
    self,
    prompt: str,
    max_retries: int = 3,
    **kwargs
) -> dict:
    """Generate with exponential backoff."""
    for attempt in range(max_retries):
        try:
            return await self.generate(prompt, **kwargs)
        except GeminiRateLimitError as e:
            if attempt == max_retries - 1:
                raise
            wait_time = 2 ** attempt  # Exponential backoff
            await asyncio.sleep(wait_time)
        except GeminiAPIError as e:
            if attempt == max_retries - 1:
                raise
            await asyncio.sleep(1)
```

**Rate Limit Handling**
- Detect 429 responses from Gemini API
- Extract retry-after header if present
- Use exponential backoff if no header
- Return 429 to frontend with retry-after header

**Timeout Handling**
- Set request timeout to 55 seconds (5 seconds buffer before FastAPI timeout)
- If timeout occurs, return 504 Gateway Timeout
- Log timeout for monitoring

### Token Usage Tracking

```python
class TokenUsage(BaseModel):
    """Token usage tracking."""
    prompt_tokens: int
    completion_tokens: int
    total_tokens: int

# Log after each API call
logger.info(
    "gemini_api_call",
    extra={
        "request_id": request_id,
        "model": model,
        "prompt_tokens": usage.prompt_tokens,
        "completion_tokens": usage.completion_tokens,
        "total_tokens": usage.total_tokens,
        "duration_ms": duration_ms
    }
)
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, I identified the following redundancies:

**Redundant Properties to Consolidate:**
1. Properties 2.6 and 2.7: Both validate Generate response structure - combine into one comprehensive property
2. Properties 1.6 and 7.6: Both about consistent error response format - combine into one property
3. Properties 1.4, 4.2, and 8.1: All about environment variable loading - combine into one property
4. Properties 1.5 and 12.5: Both about CORS validation - combine into one property
5. Properties 2.9 and 3.12: Both about invalid JSON error handling - combine into one property for both endpoints

**Properties to Keep Separate:**
- Input validation properties (2.2, 2.10, 3.2) - different endpoints, different validation rules
- Response structure properties (3.7, 3.8, 3.9, 3.10) - conditional properties with different requirements
- Module validation properties (6.1, 6.2, 6.3, 6.4) - different validation aspects

After consolidation, we have 20 unique testable properties.

### Correctness Properties

### Property 1: Environment Configuration Loading

*For any* valid set of environment variables (GEMINI_API_KEY, FRONTEND_URL, PORT, LOG_LEVEL, ENVIRONMENT), the FastAPI backend should successfully load configuration and start without errors.

**Validates: Requirements 1.4, 4.2, 8.1**

### Property 2: CORS Origin Validation

*For any* HTTP request with an origin header, the backend should allow requests from the configured FRONTEND_URL and reject requests from other origins with appropriate CORS headers.

**Validates: Requirements 1.5, 12.5**

### Property 3: Consistent Error Response Format

*For any* error that occurs during request processing, the response should include a consistent structure with fields: error (string), request_id (string), and optional details (object).

**Validates: Requirements 1.6, 7.6**

### Property 4: Generate Request Input Validation

*For any* request to /api/generate with missing or invalid query field, the endpoint should return HTTP 400 with validation error details.

**Validates: Requirements 2.2, 2.10**

### Property 5: Gemini Response JSON Parsing

*For any* response from Gemini API (valid or invalid JSON), the backend should either successfully parse it as JSON or raise a GeminiParseError with details about the parsing failure.

**Validates: Requirements 2.5, 3.6**

### Property 6: Generate Response Structure Validation

*For any* successful dashboard generation, the response should contain all required fields (dashboard, dashboard_state, generated_at) and the dashboard should contain all required nested fields (meta, tabs, chat_intro, modules).

**Validates: Requirements 2.6, 2.7, 6.1**

### Property 7: Invalid JSON Error Handling

*For any* Gemini API response that cannot be parsed as valid JSON, both /api/generate and /api/chat endpoints should return HTTP 500 with error details including the request_id.

**Validates: Requirements 2.9, 3.12**

### Property 8: Chat Request Input Validation

*For any* request to /api/chat with missing or invalid required fields (message, history, context), the endpoint should return HTTP 400 with validation error details.

**Validates: Requirements 3.2**

### Property 9: Chat Response Action Type Validation

*For any* successful chat response, the action field should be exactly one of: "CHAT", "NEW_DASHBOARD", or "TEMPORARY_TAB".

**Validates: Requirements 3.7**

### Property 10: Chat Action CHAT Field Requirements

*For any* chat response with action "CHAT", the response should include a non-null message field.

**Validates: Requirements 3.8**

### Property 11: Chat Action NEW_DASHBOARD Field Requirements

*For any* chat response with action "NEW_DASHBOARD", the response should include both non-null message and new_prompt fields.

**Validates: Requirements 3.9**

### Property 12: Chat Action TEMPORARY_TAB Field Requirements

*For any* chat response with action "TEMPORARY_TAB", the response should include non-null message, tab, and modules fields.

**Validates: Requirements 3.10**

### Property 13: Gemini Rate Limit Error Handling

*For any* Gemini API response with HTTP 429 (rate limit exceeded), the backend should return HTTP 429 to the client with a retry-after header.

**Validates: Requirements 4.7**

### Property 14: System Prompt Markdown Preservation

*For any* markdown file loaded as a system prompt, the content should preserve all markdown formatting including headers, code blocks, lists, and special characters.

**Validates: Requirements 5.5**

### Property 15: Chat Response Action Field Validation

*For any* chat response, the action field must be present and non-null.

**Validates: Requirements 6.2**

### Property 16: Module Required Fields Validation

*For any* module in a generated dashboard, all required fields (id, type, size, accent, data) must be present and non-null.

**Validates: Requirements 6.3**

### Property 17: Module Tab Reference Integrity

*For any* module with a non-null tab field, the referenced tab ID must exist in the dashboard's tabs array.

**Validates: Requirements 6.4**

### Property 18: Validation Failure Error Handling

*For any* dashboard or chat response that fails validation, the backend should log the validation errors and return HTTP 500 with error details.

**Validates: Requirements 6.5**

### Property 19: Production Error Detail Sanitization

*For any* error that occurs when ENVIRONMENT is set to "production", the error response should not include internal stack traces or sensitive implementation details.

**Validates: Requirements 7.7**

### Property 20: Configuration Default Values

*For any* optional environment variable that is not set, the backend should use a documented default value and start successfully.

**Validates: Requirements 8.3**

### Property 21: Sensitive Data Logging Prevention

*For any* log entry created by the backend, the log should not contain API keys, tokens, or other sensitive credentials.

**Validates: Requirements 12.1**

### Property 22: Request Body Size Validation

*For any* HTTP request with a body larger than 1MB, the backend should reject the request with HTTP 413 (Payload Too Large).

**Validates: Requirements 12.2**

### Property 23: Security Headers Presence

*For any* HTTP response from the backend, the response should include security headers: X-Content-Type-Options, X-Frame-Options, and X-XSS-Protection.

**Validates: Requirements 12.4**

### Property 24: Rate Limit Enforcement

*For any* client making requests exceeding the configured rate limit, the backend should return HTTP 429 after the limit is exceeded.

**Validates: Requirements 12.7**

---

## Error Handling

### Error Categories

**Client Errors (4xx)**
- 400 Bad Request: Invalid request body, missing required fields, validation errors
- 413 Payload Too Large: Request body exceeds 1MB limit
- 429 Too Many Requests: Rate limit exceeded

**Server Errors (5xx)**
- 500 Internal Server Error: Unexpected errors, validation failures, Gemini API errors
- 503 Service Unavailable: Missing configuration (API key), service not ready
- 504 Gateway Timeout: Request exceeded 60-second timeout

### Error Response Format

All error responses follow this consistent structure:

```python
{
    "error": str,           # Human-readable error message
    "request_id": str,      # Unique request identifier for tracing
    "details": dict | None  # Additional context (only in development)
}
```

**Example Error Responses**

```python
# 400 Bad Request - Missing field
{
    "error": "Validation error: field 'query' is required",
    "request_id": "req_abc123",
    "details": {
        "field": "query",
        "error_type": "missing"
    }
}

# 500 Internal Server Error - Gemini API failure
{
    "error": "Failed to generate dashboard: Gemini API error",
    "request_id": "req_xyz789",
    "details": {
        "gemini_error": "Invalid API key"
    }
}

# 503 Service Unavailable - Missing configuration
{
    "error": "Gemini API key not configured",
    "request_id": "req_def456"
}
```

### Error Handling Strategy

**Validation Errors**
- Catch Pydantic ValidationError
- Extract field-level errors
- Return 400 with detailed validation messages
- Log validation failures for monitoring

**Gemini API Errors**
- Wrap all Gemini API calls in try/except
- Distinguish between rate limits (429), auth errors (401), and other errors
- Implement retry logic with exponential backoff
- Return appropriate HTTP status codes
- Log all API errors with request context

**Timeout Errors**
- Set asyncio timeout to 55 seconds (5-second buffer)
- If timeout occurs, cancel Gemini API request
- Return 504 Gateway Timeout
- Log timeout with request details

**Unexpected Errors**
- Catch all unhandled exceptions at middleware level
- Log full stack trace with request context
- Return 500 with sanitized error message
- In production: hide internal details
- In development: include stack trace in details

### Logging Strategy

**Structured Logging Format**
```python
{
    "timestamp": "2024-01-15T10:30:45.123Z",
    "level": "ERROR",
    "request_id": "req_abc123",
    "endpoint": "/api/generate",
    "error_type": "GeminiAPIError",
    "error_message": "Rate limit exceeded",
    "user_agent": "Mozilla/5.0...",
    "duration_ms": 1234
}
```

**Log Levels**
- DEBUG: Request/response bodies (development only)
- INFO: Request start/end, API calls, performance metrics
- WARNING: Retries, rate limits, validation failures
- ERROR: API errors, unexpected exceptions
- CRITICAL: Service startup failures, missing configuration

**Sensitive Data Filtering**
- Automatically redact API keys from logs
- Redact authorization headers
- Redact user tokens or credentials
- Keep request_id for correlation

---

## Testing Strategy

### Dual Testing Approach

This project requires both unit tests and property-based tests for comprehensive coverage:

**Unit Tests**: Verify specific examples, edge cases, and integration points
- Specific request/response examples
- Error condition handling
- Middleware behavior
- Configuration loading

**Property-Based Tests**: Verify universal properties across all inputs
- Input validation for all possible invalid inputs
- Response structure validation for all possible valid responses
- Error handling consistency across all error types
- Security properties (CORS, headers, sanitization)

### Testing Framework

**Framework**: pytest with pytest-asyncio for async support
**Property Testing Library**: Hypothesis
**Mocking**: pytest-mock for Gemini API mocking
**Coverage Target**: 85% code coverage minimum

### Unit Test Categories

**1. Endpoint Tests** (`tests/test_generate.py`, `tests/test_chat.py`)
```python
# Example unit tests
def test_generate_endpoint_success():
    """Test successful dashboard generation with valid query."""
    
def test_generate_endpoint_missing_query():
    """Test 400 error when query field is missing."""
    
def test_chat_endpoint_with_empty_history():
    """Test chat endpoint with no conversation history."""
    
def test_health_endpoint_returns_200():
    """Test health check endpoint returns healthy status."""
```

**2. Service Tests** (`tests/test_services.py`)
```python
def test_generate_service_loads_prompt():
    """Test that GenerateService loads system prompt correctly."""
    
def test_chat_service_formats_history():
    """Test conversation history formatting."""
    
def test_prompt_service_handles_missing_file():
    """Test error handling when prompt file doesn't exist."""
```

**3. Integration Tests** (`tests/test_gemini_client.py`)
```python
@pytest.mark.integration
async def test_gemini_client_real_api():
    """Test actual Gemini API call (requires API key)."""
    
def test_gemini_client_retry_logic():
    """Test exponential backoff retry with mocked failures."""
    
def test_gemini_client_rate_limit_handling():
    """Test 429 response handling."""
```

**4. Validation Tests** (`tests/test_validation.py`)
```python
def test_dashboard_validator_missing_meta():
    """Test validation fails when meta field is missing."""
    
def test_module_validator_invalid_tab_reference():
    """Test validation fails when module references non-existent tab."""
    
def test_chat_validator_invalid_action_type():
    """Test validation fails for invalid action type."""
```

### Property-Based Test Configuration

**Minimum Iterations**: 100 per property test (due to randomization)
**Tag Format**: `# Feature: fastapi-backend-migration, Property {number}: {property_text}`

**Example Property Tests**

```python
from hypothesis import given, strategies as st

# Feature: fastapi-backend-migration, Property 4: Generate Request Input Validation
@given(
    request_body=st.one_of(
        st.just({}),  # Missing query
        st.fixed_dictionaries({"query": st.just("")}),  # Empty query
        st.fixed_dictionaries({"query": st.integers()}),  # Wrong type
        st.fixed_dictionaries({"wrong_field": st.text()})  # Wrong field name
    )
)
async def test_property_generate_input_validation(request_body):
    """For any invalid request body, endpoint should return 400."""
    response = await client.post("/api/generate", json=request_body)
    assert response.status_code == 400
    assert "error" in response.json()
    assert "request_id" in response.json()

# Feature: fastapi-backend-migration, Property 6: Generate Response Structure Validation
@given(
    dashboard=st.fixed_dictionaries({
        "meta": st.fixed_dictionaries({
            "subject": st.text(min_size=1),
            "mode": st.sampled_from(["company", "startup", "market"]),
            "brand_color": st.from_regex(r"#[0-9A-Fa-f]{6}"),
            "logo_initials": st.text(min_size=2, max_size=3),
            "page_title": st.text(min_size=1),
            "page_subtitle": st.text(min_size=1)
        }),
        "tabs": st.lists(
            st.fixed_dictionaries({
                "id": st.text(min_size=1),
                "label": st.text(min_size=1)
            }),
            min_size=1
        ),
        "chat_intro": st.text(min_size=1),
        "modules": st.lists(
            st.fixed_dictionaries({
                "id": st.text(min_size=1),
                "type": st.text(min_size=1),
                "size": st.from_regex(r"\d+x\d+"),
                "accent": st.sampled_from(["brand", "green", "amber", "purple"]),
                "data": st.dictionaries(st.text(), st.text())
            })
        )
    })
)
def test_property_generate_response_structure(dashboard):
    """For any valid dashboard structure, validation should pass."""
    validator = DashboardValidator()
    # Should not raise exception
    validator.validate(dashboard)

# Feature: fastapi-backend-migration, Property 17: Module Tab Reference Integrity
@given(
    dashboard=st.fixed_dictionaries({
        "tabs": st.lists(
            st.fixed_dictionaries({"id": st.text(min_size=1), "label": st.text()}),
            min_size=1,
            max_size=5
        ),
        "modules": st.lists(
            st.fixed_dictionaries({
                "id": st.text(min_size=1),
                "tab": st.text(min_size=1),  # Will be set to valid tab ID
                "type": st.text(),
                "size": st.text(),
                "accent": st.text(),
                "data": st.dictionaries(st.text(), st.text())
            }),
            min_size=1
        )
    })
)
def test_property_module_tab_reference_integrity(dashboard):
    """For any module with tab reference, the tab must exist."""
    # Set module tab references to valid tab IDs
    tab_ids = [tab["id"] for tab in dashboard["tabs"]]
    for module in dashboard["modules"]:
        module["tab"] = random.choice(tab_ids)
    
    validator = DashboardValidator()
    # Should not raise exception
    validator.validate(dashboard)

# Feature: fastapi-backend-migration, Property 21: Sensitive Data Logging Prevention
@given(
    api_key=st.text(min_size=20),
    log_message=st.text()
)
def test_property_sensitive_data_logging_prevention(api_key, log_message):
    """For any log entry, API keys should not appear in logs."""
    # Simulate logging with API key in context
    logger = setup_logger()
    with patch.object(logger, 'info') as mock_log:
        logger.info(log_message, extra={"api_key": api_key})
        
        # Check that logged message doesn't contain API key
        logged_message = mock_log.call_args[0][0]
        assert api_key not in logged_message
```

### Test Execution

**Run all tests**
```bash
pytest tests/ -v
```

**Run with coverage**
```bash
pytest tests/ --cov=app --cov-report=html --cov-report=term
```

**Run only property tests**
```bash
pytest tests/ -v -m property
```

**Run only unit tests**
```bash
pytest tests/ -v -m "not property and not integration"
```

**Run integration tests** (requires API key)
```bash
GEMINI_API_KEY=your_key pytest tests/ -v -m integration
```

### Continuous Integration

**GitHub Actions Workflow**
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: pytest tests/ --cov=app --cov-report=xml
      - uses: codecov/codecov-action@v3
```

---

## Deployment Architecture

### Docker Configuration

**Multi-Stage Dockerfile**
```dockerfile
# Stage 1: Builder
FROM python:3.11-slim as builder

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim

WORKDIR /app

# Copy dependencies from builder
COPY --from=builder /root/.local /root/.local

# Copy application code
COPY app/ ./app/
COPY prompts/ ./prompts/

# Set environment variables
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Build and Run**
```bash
# Build image
docker build -t fastapi-backend .

# Run container
docker run -p 8000:8000 \
  -e GEMINI_API_KEY=your_key \
  -e FRONTEND_URL=http://localhost:3000 \
  fastapi-backend
```

### Platform-Specific Deployment

#### Railway Deployment

**railway.json**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Environment Variables** (set in Railway dashboard)
```
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=https://your-frontend.vercel.app
ENVIRONMENT=production
LOG_LEVEL=INFO
```

**Deployment Steps**
1. Connect GitHub repository to Railway
2. Railway auto-detects Dockerfile
3. Set environment variables in Railway dashboard
4. Deploy automatically on git push
5. Railway provides public URL: `https://your-app.railway.app`

#### Render Deployment

**render.yaml**
```yaml
services:
  - type: web
    name: fastapi-backend
    env: python
    region: oregon
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    healthCheckPath: /health
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: GEMINI_API_KEY
        sync: false
      - key: FRONTEND_URL
        sync: false
      - key: ENVIRONMENT
        value: production
      - key: LOG_LEVEL
        value: INFO
```

**Deployment Steps**
1. Connect GitHub repository to Render
2. Render reads render.yaml configuration
3. Set secret environment variables in Render dashboard
4. Deploy automatically on git push
5. Render provides public URL: `https://your-app.onrender.com`

#### Vercel Deployment (Serverless)

**Note**: FastAPI on Vercel requires serverless adapter

**vercel.json**
```json
{
  "builds": [
    {
      "src": "app/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app/main.py"
    }
  ]
}
```

**Deployment Steps**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Set environment variables: `vercel env add GEMINI_API_KEY`
4. Deploy: `vercel --prod`
5. Vercel provides public URL: `https://your-app.vercel.app`

**Limitations on Vercel**
- 10-second timeout on free tier (may need Pro for 60-second timeout)
- Cold starts may add 1-2 seconds latency
- Consider Railway or Render for better performance

### Environment Configuration

**.env.example**
```bash
# Required
GEMINI_API_KEY=your_gemini_api_key_here

# Optional (with defaults)
FRONTEND_URL=http://localhost:3000
PORT=8000
ENVIRONMENT=development
LOG_LEVEL=INFO

# Optional features
ENABLE_CACHING=false
REDIS_URL=redis://localhost:6379
RATE_LIMIT_PER_MINUTE=60
```

### Monitoring and Observability

**Health Check Endpoint**
```python
@app.get("/health")
async def health_check():
    """Health check for load balancers and monitoring."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "version": "1.0.0",
        "gemini_configured": bool(config.GEMINI_API_KEY)
    }
```

**Metrics to Monitor**
- Request rate (requests/minute)
- Response time (P50, P95, P99)
- Error rate (4xx, 5xx)
- Gemini API latency
- Token usage
- Cache hit rate (if caching enabled)

**Logging Integration**
- Structured JSON logs for easy parsing
- Request ID correlation across logs
- Integration with log aggregation services (Datadog, LogDNA, etc.)

---

## Migration Strategy

### Phase 1: Parallel Deployment (Week 1)

**Goal**: Deploy FastAPI backend alongside n8n without affecting production

**Steps**:
1. Deploy FastAPI backend to Railway/Render
2. Configure environment variables
3. Test health endpoint
4. Verify Gemini API integration
5. Run smoke tests against deployed backend

**Success Criteria**:
- FastAPI backend responds to health checks
- Generate endpoint returns valid dashboards
- Chat endpoint handles conversations
- Response times < 30 seconds

### Phase 2: Frontend Feature Flag (Week 1-2)

**Goal**: Enable frontend to switch between backends

**Frontend Changes** (kore-frontend/.env.local):
```bash
# Feature flag
BACKEND_TYPE=n8n  # or "fastapi"

# n8n configuration (existing)
N8N_GENERATE_WEBHOOK=https://n8n.example.com/webhook/generate
N8N_CHAT_WEBHOOK=https://n8n.example.com/webhook/chat

# FastAPI configuration (new)
FASTAPI_BASE_URL=https://your-app.railway.app
```

**Frontend Code Changes** (kore-frontend/src/lib/api.ts):
```typescript
const BACKEND_TYPE = process.env.BACKEND_TYPE || 'n8n'
const FASTAPI_BASE_URL = process.env.FASTAPI_BASE_URL

export async function generateDashboard(query: string): Promise<GenerateResponse> {
  const url = BACKEND_TYPE === 'fastapi'
    ? `${FASTAPI_BASE_URL}/api/generate`
    : '/api/generate'  // Next.js proxy to n8n
    
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  
  // Rest of implementation unchanged
}
```

**Success Criteria**:
- Frontend can switch backends via environment variable
- Both backends work without code changes
- API contract compatibility verified

### Phase 3: Gradual Rollout (Week 2-3)

**Goal**: Gradually shift traffic to FastAPI backend

**Rollout Plan**:
1. **10% traffic**: Internal testing team only
2. **25% traffic**: Early adopters, monitor for issues
3. **50% traffic**: Half of users, compare metrics
4. **100% traffic**: Full migration if metrics are good

**Monitoring During Rollout**:
- Compare response times: n8n vs FastAPI
- Compare error rates
- Monitor user feedback
- Track Gemini API costs

**Rollback Plan**:
- If error rate > 5%: rollback to n8n
- If response time > 45 seconds: investigate and optimize
- Keep n8n running for 2 weeks after 100% rollout

### Phase 4: n8n Deprecation (Week 4)

**Goal**: Fully migrate to FastAPI and decommission n8n

**Steps**:
1. Verify 100% traffic on FastAPI for 1 week
2. Remove n8n environment variables from frontend
3. Remove n8n proxy routes from Next.js
4. Archive n8n workflows for reference
5. Shut down n8n instance

**Success Criteria**:
- Zero traffic to n8n for 7 days
- No user-reported issues
- Response times consistently < 30 seconds
- Error rate < 1%

### Rollback Procedure

**If issues occur during migration**:

1. **Immediate Rollback** (< 5 minutes):
   ```bash
   # Update frontend environment variable
   BACKEND_TYPE=n8n
   
   # Redeploy frontend
   vercel --prod
   ```

2. **Verify Rollback**:
   - Check health endpoint
   - Test generate endpoint
   - Test chat endpoint
   - Monitor error logs

3. **Post-Rollback Analysis**:
   - Review error logs
   - Identify root cause
   - Fix issues in FastAPI backend
   - Re-test before next rollout attempt

### Migration Checklist

**Pre-Migration**:
- [ ] FastAPI backend deployed and healthy
- [ ] Environment variables configured
- [ ] System prompts copied to prompts/ directory
- [ ] Frontend feature flag implemented
- [ ] Monitoring dashboards set up
- [ ] Rollback procedure documented

**During Migration**:
- [ ] Monitor error rates
- [ ] Monitor response times
- [ ] Monitor Gemini API usage
- [ ] Collect user feedback
- [ ] Compare metrics: n8n vs FastAPI

**Post-Migration**:
- [ ] 100% traffic on FastAPI for 7 days
- [ ] No critical issues reported
- [ ] Response times improved
- [ ] n8n workflows archived
- [ ] n8n instance shut down
- [ ] Documentation updated

---

## Summary

This design document specifies a complete FastAPI backend migration that:

1. **Maintains 100% API compatibility** with the existing Next.js frontend
2. **Reduces latency from 2-3 minutes to under 30 seconds** through direct Gemini API integration
3. **Provides comprehensive error handling and validation** for production reliability
4. **Supports multiple deployment platforms** (Railway, Render, Vercel)
5. **Enables zero-downtime migration** through parallel deployment and feature flags
6. **Includes extensive testing strategy** with both unit tests and property-based tests

The architecture is clean, maintainable, and production-ready, with clear separation of concerns across API, service, integration, and validation layers.
