# TACO Quick Start Guide 🌮

## What is TACO?

**TACO** is your Groq-powered AI option in the KORE Dashboard. When you select TACO, the system automatically uses:
- **Provider**: Groq (ultra-fast inference)
- **Model**: `llama-3.3-70b-versatile` (Meta's latest 70B model)
- **Speed**: ⚡ Lightning fast responses

## How to Use TACO

### Step 1: Select TACO

In the frontend, click the API key dropdown and select **TACO**.

### Step 2: That's it!

The system automatically:
1. Detects it's a Groq key (starts with `gsk_`)
2. Creates a Groq client
3. Uses the `llama-3.3-70b-versatile` model
4. Sends your request to Groq API
5. Returns the response

**No configuration needed!**

## What Makes TACO Special?

### ⚡ Speed
Groq is known for **extremely fast inference**. Your dashboards generate faster with TACO.

### 🎯 Quality
Uses Meta's latest `llama-3.3-70b-versatile` model - a powerful 70B parameter model.

### 💰 Cost-Effective
Groq offers competitive pricing with generous rate limits.

### 🔄 Seamless
Works exactly like other API keys - just select and go!

## Testing TACO

Want to verify TACO is working? Run the test:

```bash
cd fastapi-backend
python test_taco_integration.py
```

You should see:
```
🎉 ALL TESTS PASSED!
✅ TACO integration is working correctly!
✅ When you select TACO in the frontend, it will use Groq API
✅ Model: llama-3.3-70b-versatile

You're ready to use TACO! 🌮
```

## Switching Between Providers

You can easily switch between AI providers:

- **TACO** → Groq (llama-3.3-70b-versatile)
- **Max** → Gemini (gemini-2.5-flash)
- **Sam** → Gemini (gemini-2.5-flash)
- **Alex** → Gemini (gemini-2.5-flash)
- **Jordan** → Gemini (gemini-2.5-flash)

Just select the one you want from the dropdown!

## Technical Details

### API Key Format
- **Groq keys** start with: `gsk_`
- **Gemini keys** start with: `AIzaSy`

The system automatically detects which provider to use based on this prefix.

### Current TACO Key
```
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
```

### Model Information
- **Name**: llama-3.3-70b-versatile
- **Parameters**: 70 billion
- **Provider**: Meta (via Groq)
- **Context Window**: Large
- **Speed**: Ultra-fast

## Troubleshooting

### TACO not working?

1. **Check the key**: Make sure it starts with `gsk_`
2. **Run the test**: `python test_taco_integration.py`
3. **Check logs**: Look for "Creating Groq client" in backend logs
4. **Verify selection**: Ensure TACO is selected in the dropdown

### Still having issues?

Check the comprehensive guide: `fastapi-backend/GROQ_INTEGRATION.md`

## Summary

✅ Select TACO in the frontend
✅ System automatically uses Groq
✅ Get ultra-fast responses
✅ Same quality as other providers
✅ Zero configuration needed

**Enjoy your TACO! 🌮**
