"""
Test different OpenRouter free models to find one that works.
"""

import asyncio
import httpx


async def test_model(api_key: str, model: str, prompt: str = "Say hello in JSON format with a 'message' field"):
    """Test a specific model."""
    print(f"\n{'='*60}")
    print(f"Testing: {model}")
    print(f"{'='*60}")
    
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    
    payload = {
        "model": model,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 100,
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload
            )
            
            if response.status_code == 200:
                result = response.json()
                content = result.get("choices", [{}])[0].get("message", {}).get("content", "")
                print(f"✅ SUCCESS!")
                print(f"   Response: {content[:100]}...")
                return True
            else:
                error = response.json()
                error_msg = error.get("error", {}).get("message", "Unknown error")
                print(f"❌ FAILED: {error_msg}")
                return False
                
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False


async def main():
    """Test multiple free models."""
    api_key = "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"
    
    # List of free models to test (from OpenRouter docs)
    models_to_test = [
        "google/gemma-2-9b-it:free",
        "meta-llama/llama-3.2-3b-instruct:free",
        "meta-llama/llama-3.2-1b-instruct:free",
        "microsoft/phi-3-mini-128k-instruct:free",
        "microsoft/phi-3-medium-128k-instruct:free",
        "qwen/qwen-2-7b-instruct:free",
        "mistralai/mistral-7b-instruct:free",
    ]
    
    print("\n" + "="*80)
    print("OPENROUTER FREE MODELS TEST")
    print("="*80)
    print(f"\nTesting {len(models_to_test)} free models...")
    
    results = []
    
    for model in models_to_test:
        success = await test_model(api_key, model)
        results.append((model, success))
        await asyncio.sleep(2)  # Wait between requests
    
    # Summary
    print("\n" + "="*80)
    print("RESULTS SUMMARY")
    print("="*80)
    
    working_models = []
    failed_models = []
    
    for model, success in results:
        if success:
            print(f"✅ {model}")
            working_models.append(model)
        else:
            print(f"❌ {model}")
            failed_models.append(model)
    
    if working_models:
        print(f"\n🎉 Found {len(working_models)} working model(s)!")
        print("\n📋 Recommended model to use:")
        print(f"   {working_models[0]}")
    else:
        print("\n⚠️  No working models found. OpenRouter free tier may be rate-limited.")
        print("   Consider:")
        print("   1. Wait a few minutes and retry")
        print("   2. Add your own API key at https://openrouter.ai/settings/integrations")
        print("   3. Use a different provider (Gemini, Groq)")


if __name__ == "__main__":
    asyncio.run(main())
