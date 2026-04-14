# Groq Integration Guide

## Overview

The KORE Dashboard now supports **both Gemini and Groq** AI providers with automatic detection based on API key prefix. When you select **TACO** in the frontend, it automatically uses the Groq API with the `llama-3.3-70b-versatile` model.

## How It Works

### 1. **Automatic Provider Detection**

The system automatically detects which AI provider to use based on the API key prefix:

- **Gemini keys** start with: `AIzaSy`
- **Groq keys** start with: `gsk_`

### 2. **Frontend Configuration**

In `kore-frontend/.env.local`:

```env
# TACO uses Groq API
NEXT_PUBLIC_GEMINI_KEY_1=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

# Other keys use Gemini
NEXT_PUBLIC_GEMINI_KEY_2=AIzaSyAw40Osfw1IQzHZYJnpNnwXcrVN5XmNTL0
NEXT_PUBLIC_GEMINI_KEY_3=AIzaSyCN-jBh4akNZqxZ-gF90buz5LbpxBm9qcI
# ... etc
```

### 3. **Request Flow**

```
Frontend (Select TACO)
    ↓
    Sends request with X-Gemini-Api-Key: gsk_7d9rQ3dLZdRSiUnq...
    ↓
Backend (AIClientFactory)
    ↓
    Detects "gsk_" prefix → Creates GroqClient
    ↓
    Uses model: llama-3.3-70b-versatile
    ↓
Groq API
    ↓
    Returns JSON response
    ↓
Frontend (Displays dashboard)
```

## Architecture

### Key Components

1. **AIClientFactory** (`app/integrations/ai_client_factory.py`)
   - Detects provider from API key prefix
   - Creates appropriate client (GeminiClient or GroqClient)
   - Sets default models for each provider

2. **GroqClient** (`app/integrations/groq_client.py`)
   - Wrapper for Groq API
   - Implements same interface as GeminiClient
   - Handles retry logic and error handling
   - Supports JSON mode

3. **GeminiClient** (`app/integrations/gemini_client.py`)
   - Existing Gemini API wrapper
   - Unchanged, fully compatible

4. **Services** (`app/services/`)
   - GenerateService: Uses AIClientFactory for dashboard generation
   - ChatService: Uses AIClientFactory for chat interactions
   - Both services work with either provider transparently

### Default Models

- **Groq**: `llama-3.3-70b-versatile` (Meta's latest 70B model)
- **Gemini**: `gemini-2.5-flash` (Google's fast model)

## Usage

### From Frontend

Simply select **TACO** from the API key dropdown. The system automatically:
1. Detects it's a Groq key
2. Creates a GroqClient
3. Uses `llama-3.3-70b-versatile` model
4. Sends requests to Groq API

### From Backend

The backend automatically handles both providers:

```python
from app.integrations.ai_client_factory import AIClientFactory

# Automatic detection
client = AIClientFactory.create_client(api_key="gsk_...")  # Creates GroqClient
client = AIClientFactory.create_client(api_key="AIzaSy...")  # Creates GeminiClient

# Manual detection
provider = AIClientFactory.detect_provider("gsk_...")  # Returns "groq"
provider = AIClientFactory.detect_provider("AIzaSy...")  # Returns "gemini"
```

## Testing

Run the comprehensive integration test:

```bash
cd fastapi-backend
python test_taco_integration.py
```

This tests:
1. ✅ API key detection
2. ✅ Client creation
3. ✅ Groq API calls
4. ✅ Full integration flow

## Available Groq Models

You can use any of these models with Groq:

- `llama-3.3-70b-versatile` (default, recommended)
- `llama-3.1-8b-instant` (faster, smaller)
- `openai/gpt-oss-120b` (larger model)
- `groq/compound` (Groq's own model)

To use a different model, pass it in the request header:
```
X-Gemini-Model: llama-3.1-8b-instant
```

## Error Handling

Both clients use the same error types for compatibility:

- `GeminiAPIError`: General API errors
- `GeminiRateLimitError`: Rate limit exceeded
- `GeminiParseError`: JSON parsing failed

This means existing error handling works for both providers.

## Performance

**Groq Advantages:**
- ⚡ **Extremely fast inference** (Groq is known for speed)
- 🚀 **Low latency** responses
- 💰 **Competitive pricing**

**Gemini Advantages:**
- 🎯 **Larger context window**
- 🔧 **More fine-tuning options**
- 📊 **Better for complex reasoning**

## Configuration

### Backend (.env)

```env
# Use Groq as default
GEMINI_API_KEY=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

# Or use Gemini as default
GEMINI_API_KEY=AIzaSyAa-AyiIcmiRq4MQYkNOSq9D3ZxFQLmvqw
```

### Frontend (.env.local)

```env
# TACO = Groq
NEXT_PUBLIC_GEMINI_KEY_1=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

# Others = Gemini
NEXT_PUBLIC_GEMINI_KEY_2=AIzaSyAw40Osfw1IQzHZYJnpNnwXcrVN5XmNTL0
NEXT_PUBLIC_GEMINI_KEY_3=AIzaSyCN-jBh4akNZqxZ-gF90buz5LbpxBm9qcI
NEXT_PUBLIC_GEMINI_KEY_4=AIzaSyC7TrCKOoyRROLgGDtoqfN4ydWDY57uCSk
NEXT_PUBLIC_GEMINI_KEY_5=AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk
```

## Troubleshooting

### Issue: "Invalid API key format"

**Solution**: Ensure your Groq key starts with `gsk_`

### Issue: "Model not found"

**Solution**: Use one of the available Groq models listed above

### Issue: "Rate limit exceeded"

**Solution**: Groq has generous rate limits, but if exceeded, the system will automatically retry with exponential backoff

## Migration Guide

### Existing Code

No changes needed! The integration is backward compatible:

```python
# Old code still works
from app.dependencies import get_gemini_client
client = get_gemini_client()  # Returns GeminiClient or GroqClient based on config
```

### New Code

Use the factory for explicit control:

```python
from app.integrations.ai_client_factory import AIClientFactory

# Automatic detection
client = AIClientFactory.create_client(api_key=user_provided_key)

# Check provider
if AIClientFactory.is_groq_key(api_key):
    print("Using Groq!")
```

## Summary

✅ **Zero configuration needed** - Just select TACO in the frontend
✅ **Automatic detection** - System knows which provider to use
✅ **Same interface** - Both clients work identically
✅ **Full compatibility** - Existing code works without changes
✅ **Fast inference** - Groq provides extremely fast responses
✅ **Easy testing** - Comprehensive test suite included

**You're ready to use TACO! 🌮**
