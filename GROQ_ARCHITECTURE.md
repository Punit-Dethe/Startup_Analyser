# Groq Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Key Selector                                         │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │  │
│  │  │Default │ │  TACO  │ │  Max   │ │  Sam   │ │  Alex  │ │  │
│  │  │        │ │  🌮    │ │        │ │        │ │        │ │  │
│  │  │Backend │ │ Groq   │ │ Gemini │ │ Gemini │ │ Gemini │ │  │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              │ HTTP Request                      │
│                              │ X-Gemini-Api-Key: gsk_...        │
│                              ↓                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  FastAPI Routes                                           │  │
│  │  • /generate (Dashboard generation)                       │  │
│  │  • /chat (Chat interactions)                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Services Layer                                           │  │
│  │  • GenerateService                                        │  │
│  │  • ChatService                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ↓                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AIClientFactory                                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  detect_provider(api_key)                          │  │  │
│  │  │  ┌──────────────────────────────────────────────┐  │  │  │
│  │  │  │  if api_key.startswith("gsk_"):              │  │  │  │
│  │  │  │      return "groq"                            │  │  │  │
│  │  │  │  elif api_key.startswith("AIzaSy"):          │  │  │  │
│  │  │  │      return "gemini"                          │  │  │  │
│  │  │  └──────────────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                    ┌─────────┴─────────┐                        │
│                    │                   │                         │
│                    ↓                   ↓                         │
│  ┌─────────────────────────┐  ┌─────────────────────────┐      │
│  │  GroqClient             │  │  GeminiClient           │      │
│  │  • Model: llama-3.3-70b │  │  • Model: gemini-2.5    │      │
│  │  • JSON mode            │  │  • JSON mode            │      │
│  │  • Retry logic          │  │  • Retry logic          │      │
│  │  • Error handling       │  │  • Error handling       │      │
│  └─────────────────────────┘  └─────────────────────────┘      │
│              │                              │                    │
└──────────────┼──────────────────────────────┼───────────────────┘
               │                              │
               ↓                              ↓
┌─────────────────────────┐  ┌─────────────────────────┐
│  Groq API               │  │  Gemini API             │
│  • Ultra-fast inference │  │  • Google AI            │
│  • llama-3.3-70b        │  │  • gemini-2.5-flash     │
│  • Meta model           │  │  • Large context        │
└─────────────────────────┘  └─────────────────────────┘
```

## API Key Detection Logic

```
┌─────────────────────────────────────────────────────────────┐
│  API Key Input                                               │
│  Example: "gsk_7d9rQ3dLZdRSiUnq908IWGdyb3FY..."            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  AIClientFactory.detect_provider()                           │
│                                                              │
│  Check prefix:                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  if key.startswith("gsk_"):                          │  │
│  │      provider = "groq"                                │  │
│  │      default_model = "llama-3.3-70b-versatile"       │  │
│  │                                                        │  │
│  │  elif key.startswith("AIzaSy"):                      │  │
│  │      provider = "gemini"                              │  │
│  │      default_model = "gemini-2.5-flash"              │  │
│  │                                                        │  │
│  │  else:                                                 │  │
│  │      raise ValueError("Invalid API key format")       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Create Client                                               │
│                                                              │
│  if provider == "groq":                                      │
│      return GroqClient(api_key, model)                      │
│  else:                                                       │
│      return GeminiClient(api_key, model)                    │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow Diagram

```
┌──────────────┐
│   Frontend   │
│   (TACO)     │
└──────┬───────┘
       │
       │ 1. User selects TACO
       │    API Key: gsk_7d9rQ3dLZdRSiUnq...
       │
       ↓
┌──────────────────────────────────────────────────────────┐
│  POST /generate                                           │
│  Headers:                                                 │
│    X-Gemini-Api-Key: gsk_7d9rQ3dLZdRSiUnq...            │
│    X-Analysis-Mode: startup                               │
│  Body:                                                    │
│    { "query": "Analyze ChargeConnect startup" }          │
└──────┬───────────────────────────────────────────────────┘
       │
       │ 2. Backend receives request
       │
       ↓
┌──────────────────────────────────────────────────────────┐
│  GenerateService.generate()                               │
│                                                           │
│  • Receives api_key from header                          │
│  • Calls AIClientFactory.create_client(api_key)          │
└──────┬───────────────────────────────────────────────────┘
       │
       │ 3. Factory detects provider
       │
       ↓
┌──────────────────────────────────────────────────────────┐
│  AIClientFactory.detect_provider()                        │
│                                                           │
│  • Checks prefix: "gsk_" → Groq                          │
│  • Creates GroqClient                                     │
│  • Sets model: llama-3.3-70b-versatile                   │
└──────┬───────────────────────────────────────────────────┘
       │
       │ 4. Client created
       │
       ↓
┌──────────────────────────────────────────────────────────┐
│  GroqClient.generate_with_retry()                         │
│                                                           │
│  • Loads prompt: prompts/startupanalysis.md              │
│  • Formats request with system + user prompt             │
│  • Enables JSON mode                                      │
│  • Sets temperature: 0.7                                  │
└──────┬───────────────────────────────────────────────────┘
       │
       │ 5. Send to Groq API
       │
       ↓
┌──────────────────────────────────────────────────────────┐
│  Groq API                                                 │
│                                                           │
│  POST https://api.groq.com/openai/v1/chat/completions   │
│  {                                                        │
│    "model": "llama-3.3-70b-versatile",                   │
│    "messages": [...],                                     │
│    "response_format": {"type": "json_object"},           │
│    "temperature": 0.7                                     │
│  }                                                        │
└──────┬───────────────────────────────────────────────────┘
       │
       │ 6. Groq processes (ultra-fast!)
       │
       ↓
┌──────────────────────────────────────────────────────────┐
│  Response                                                 │
│  {                                                        │
│    "meta": {...},                                         │
│    "tabs": [...],                                         │
│    "modules": [...]                                       │
│  }                                                        │
└──────┬───────────────────────────────────────────────────┘
       │
       │ 7. Parse JSON
       │
       ↓
┌──────────────────────────────────────────────────────────┐
│  GroqClient._extract_json()                               │
│                                                           │
│  • Parses JSON response                                   │
│  • Validates structure                                    │
│  • Returns dict                                           │
└──────┬───────────────────────────────────────────────────┘
       │
       │ 8. Validate dashboard
       │
       ↓
┌──────────────────────────────────────────────────────────┐
│  DashboardValidator.validate()                            │
│                                                           │
│  • Checks required fields                                 │
│  • Validates module types                                 │
│  • Ensures grid constraints                               │
└──────┬───────────────────────────────────────────────────┘
       │
       │ 9. Return to frontend
       │
       ↓
┌──────────────────────────────────────────────────────────┐
│  Frontend                                                 │
│                                                           │
│  • Receives dashboard JSON                                │
│  • Renders modules                                        │
│  • Displays to user                                       │
└──────────────────────────────────────────────────────────┘
```

## Class Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  AIClientFactory                                             │
├─────────────────────────────────────────────────────────────┤
│  + GEMINI_PREFIX = "AIzaSy"                                 │
│  + GROQ_PREFIX = "gsk_"                                     │
│  + DEFAULT_GEMINI_MODEL = "gemini-2.5-flash"               │
│  + DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile"          │
├─────────────────────────────────────────────────────────────┤
│  + create_client(api_key, model?) → Client                 │
│  + detect_provider(api_key) → str                           │
│  + is_gemini_key(api_key) → bool                            │
│  + is_groq_key(api_key) → bool                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ creates
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ↓                           ↓
┌──────────────────────────┐  ┌──────────────────────────┐
│  GroqClient              │  │  GeminiClient            │
├──────────────────────────┤  ├──────────────────────────┤
│  - api_key: str          │  │  - api_key: str          │
│  - model_name: str       │  │  - model_name: str       │
│  - client: AsyncGroq     │  │  - model: GenerativeModel│
├──────────────────────────┤  ├──────────────────────────┤
│  + generate()            │  │  + generate()            │
│  + generate_with_retry() │  │  + generate_with_retry() │
│  + reconfigure()         │  │  + reconfigure()         │
│  + reconfigure_model()   │  │  + reconfigure_model()   │
│  - _extract_json()       │  │  - _extract_json()       │
└──────────────────────────┘  └──────────────────────────┘
              │                           │
              │                           │
              └─────────────┬─────────────┘
                            │
                            │ used by
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ↓                           ↓
┌──────────────────────────┐  ┌──────────────────────────┐
│  GenerateService         │  │  ChatService             │
├──────────────────────────┤  ├──────────────────────────┤
│  - ai_client: Client     │  │  - ai_client: Client     │
│  - prompt_service        │  │  - prompt_service        │
│  - validator             │  │  - validator             │
├──────────────────────────┤  ├──────────────────────────┤
│  + generate()            │  │  + chat()                │
└──────────────────────────┘  └──────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────┐
│  API Call                                                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Try: client.generate()                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ↓                       ↓
┌──────────────────────┐  ┌──────────────────────────────────┐
│  Success             │  │  Error                            │
│  • Parse JSON        │  │  ┌────────────────────────────┐  │
│  • Return response   │  │  │  RateLimitError            │  │
└──────────────────────┘  │  │  → GeminiRateLimitError    │  │
                          │  │  → Retry with backoff      │  │
                          │  └────────────────────────────┘  │
                          │  ┌────────────────────────────┐  │
                          │  │  AuthenticationError       │  │
                          │  │  → GeminiAPIError          │  │
                          │  │  → Return error to user    │  │
                          │  └────────────────────────────┘  │
                          │  ┌────────────────────────────┐  │
                          │  │  APIError                  │  │
                          │  │  → GeminiAPIError          │  │
                          │  │  → Retry with backoff      │  │
                          │  └────────────────────────────┘  │
                          │  ┌────────────────────────────┐  │
                          │  │  TimeoutError              │  │
                          │  │  → GeminiAPIError          │  │
                          │  │  → Return timeout error    │  │
                          │  └────────────────────────────┘  │
                          └──────────────────────────────────┘
```

## Configuration Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Environment Variables                                       │
│                                                              │
│  Backend (.env):                                             │
│    GEMINI_API_KEY=gsk_... or AIzaSy...                      │
│                                                              │
│  Frontend (.env.local):                                      │
│    NEXT_PUBLIC_GEMINI_KEY_1=gsk_... (TACO)                  │
│    NEXT_PUBLIC_GEMINI_KEY_2=AIzaSy... (Max)                 │
│    NEXT_PUBLIC_GEMINI_KEY_3=AIzaSy... (Sam)                 │
│    NEXT_PUBLIC_GEMINI_KEY_4=AIzaSy... (Alex)                │
│    NEXT_PUBLIC_GEMINI_KEY_5=AIzaSy... (Jordan)              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Application Startup                                         │
│                                                              │
│  Backend:                                                    │
│    • Loads GEMINI_API_KEY from .env                         │
│    • Creates default client via AIClientFactory             │
│    • Auto-detects provider from key prefix                  │
│                                                              │
│  Frontend:                                                   │
│    • Loads all API keys from .env.local                     │
│    • Displays in dropdown (Default, TACO, Max, etc.)        │
│    • Stores selected key in localStorage                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  Runtime                                                     │
│                                                              │
│  • User selects API key from dropdown                        │
│  • Frontend sends key in X-Gemini-Api-Key header            │
│  • Backend creates appropriate client                        │
│  • Request processed with selected provider                  │
└─────────────────────────────────────────────────────────────┘
```

## Summary

This architecture provides:

✅ **Automatic Detection**: No manual configuration
✅ **Unified Interface**: Both clients work identically
✅ **Error Handling**: Comprehensive retry logic
✅ **Flexibility**: Easy to add more providers
✅ **Performance**: Groq provides ultra-fast inference
✅ **Compatibility**: Backward compatible with existing code

**The system automatically routes requests to the correct provider based on the API key prefix.**
