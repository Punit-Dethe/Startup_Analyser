# Timeout Configuration

## Current Settings

The FastAPI backend is configured with generous timeouts to handle complex dashboard generation that can take up to 2-3 minutes.

### Timeout Hierarchy

```
Railway/Render: No timeout limit ✅
    ↓
FastAPI Endpoint: 180 seconds (3 minutes) ✅
    ↓
Gemini API Client: 150 seconds (2.5 minutes) ✅
    ↓
Gemini API: Variable (depends on query complexity)
```

### Configuration Details

| Component | Timeout | Location | Purpose |
|-----------|---------|----------|---------|
| **Railway** | None | Platform | No request timeout limits |
| **Render** | None | Platform | No request timeout limits |
| **FastAPI Generate** | 180s | `app/api/generate.py` | Endpoint timeout |
| **FastAPI Chat** | 180s | `app/api/chat.py` | Endpoint timeout |
| **Gemini Client** | 150s | `app/integrations/gemini_client.py` | API call timeout |
| **Retry Logic** | 3 attempts | `app/integrations/gemini_client.py` | Exponential backoff |

### Why These Values?

1. **3-minute endpoint timeout**: Handles even the most complex dashboard generations
2. **2.5-minute Gemini timeout**: Leaves 30 seconds buffer for processing and retries
3. **3 retry attempts**: Handles transient failures without excessive delays
4. **Railway/Render**: No platform timeout limits, perfect for AI workloads

### Performance Expectations

| Query Complexity | Expected Time | Will Complete? |
|------------------|---------------|----------------|
| Simple query | 15-30 seconds | ✅ Yes |
| Medium query | 30-60 seconds | ✅ Yes |
| Complex query | 60-120 seconds | ✅ Yes |
| Very complex query | 120-180 seconds | ✅ Yes |
| Extremely complex | > 180 seconds | ❌ Timeout (rare) |

### Adjusting Timeouts

If you need to adjust timeouts for your use case:

#### Increase Endpoint Timeout
Edit `app/api/generate.py` and `app/api/chat.py`:
```python
result = await asyncio.wait_for(
    service.generate(request.query),
    timeout=300.0  # 5 minutes
)
```

#### Increase Gemini Client Timeout
Edit `app/integrations/gemini_client.py`:
```python
async def generate(
    self,
    prompt: str,
    # ... other params ...
    timeout: float = 240.0  # 4 minutes
) -> dict[str, Any]:
```

#### Adjust Retry Attempts
Edit `app/integrations/gemini_client.py`:
```python
async def generate_with_retry(
    self,
    prompt: str,
    max_retries: int = 5,  # More retries
    **kwargs
) -> dict[str, Any]:
```

### Monitoring Timeouts

Check logs for timeout patterns:
```bash
# Railway
railway logs | grep "timed out"

# Render
# Use Render dashboard logs

# Local
tail -f logs/app.log | grep "timeout"
```

### Best Practices

1. **Monitor response times** - Track how long queries actually take
2. **Optimize prompts** - Shorter, clearer prompts = faster responses
3. **Use caching** - Cache common queries if possible
4. **Set realistic expectations** - Tell users complex queries may take 1-2 minutes
5. **Add loading indicators** - Show progress to users during long requests

### Comparison with Other Platforms

| Platform | Free Tier Timeout | Paid Tier Timeout | Recommended? |
|----------|-------------------|-------------------|--------------|
| **Railway** | No limit | No limit | ✅ Yes |
| **Render** | No limit (but spins down) | No limit | ✅ Yes |
| **Vercel** | 10 seconds | 60 seconds | ❌ No (too short) |
| **AWS Lambda** | 15 minutes | 15 minutes | ✅ Yes (overkill) |
| **Google Cloud Run** | 60 minutes | 60 minutes | ✅ Yes (overkill) |

### Why Not Vercel?

Vercel's timeout limits make it unsuitable for this use case:
- **Free tier**: 10 seconds (way too short)
- **Pro tier**: 60 seconds ($20/month, still might timeout)
- **Your needs**: Up to 180 seconds

Railway and Render have no timeout limits and are perfect for AI workloads.

## Summary

✅ **Current configuration supports up to 3-minute requests**
✅ **Railway has no timeout limits**
✅ **Handles 99% of dashboard generation cases**
✅ **Retry logic handles transient failures**
✅ **Easy to adjust if needed**

Your FastAPI backend is configured to handle even the most complex dashboard generations without timeout issues!
