"""
Direct test of OpenRouter API with the startup analysis prompt.
Tests the google/gemma-4-31b-it:free model.
"""

import asyncio
import os
import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from app.integrations.openrouter_client import OpenRouterClient
from app.integrations.ai_client_factory import AIClientFactory


async def test_openrouter_simple():
    """Test OpenRouter with a simple prompt."""
    print("\n" + "="*80)
    print("TEST 1: Simple OpenRouter API Call")
    print("="*80)
    
    api_key = "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"
    model = "nvidia/nemotron-3-super-120b-a12b:free"
    
    print(f"\n✓ API Key: {api_key[:20]}...")
    print(f"✓ Model: {model}")
    
    # Create client
    client = OpenRouterClient(api_key=api_key, model=model)
    
    # Simple test prompt
    prompt = "Generate a JSON object with a single field 'message' containing 'Hello from OpenRouter!'"
    
    print(f"\n✓ Prompt: {prompt}")
    print("\n⏳ Sending request to OpenRouter...")
    
    try:
        result = await client.generate(
            prompt=prompt,
            system_prompt="You are a helpful assistant that responds in JSON format.",
            temperature=0.7,
            max_tokens=100,
            json_mode=True,
            timeout=60.0
        )
        
        print("\n✅ SUCCESS! Response received:")
        print(f"   {result}")
        return True
        
    except Exception as e:
        print(f"\n❌ FAILED: {e}")
        return False


async def test_openrouter_with_startup_prompt():
    """Test OpenRouter with the actual startup analysis prompt."""
    print("\n" + "="*80)
    print("TEST 2: OpenRouter with Startup Analysis Prompt")
    print("="*80)
    
    api_key = "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"
    model = "nvidia/nemotron-3-super-120b-a12b:free"
    
    # Load the actual startup analysis prompt
    prompt_path = Path(__file__).parent / "prompts" / "startupanalysis.md"
    
    if not prompt_path.exists():
        print(f"\n❌ Prompt file not found: {prompt_path}")
        return False
    
    with open(prompt_path, 'r', encoding='utf-8') as f:
        system_prompt = f.read()
    
    print(f"\n✓ Loaded system prompt: {len(system_prompt)} characters")
    print(f"✓ Model: {model}")
    
    # Create client
    client = OpenRouterClient(api_key=api_key, model=model)
    
    # Test with a simple startup idea
    user_prompt = """Food delivery startup in India with ₹50L budget.

Focus on tier-2 cities with hyperlocal delivery model. Partner with local restaurants and home chefs. 
Revenue from delivery fees (₹30-50 per order) and restaurant commissions (15-20%). 
Target market: 18-35 year olds in cities like Indore, Jaipur, Lucknow."""
    
    print(f"\n✓ User prompt: {user_prompt[:100]}...")
    print("\n⏳ Sending request to OpenRouter (this may take 30-60 seconds)...")
    
    try:
        result = await client.generate(
            prompt=user_prompt,
            system_prompt=system_prompt,
            temperature=0.7,
            max_tokens=8192,
            json_mode=False,  # Try without JSON mode first
            timeout=300.0  # 5 minutes
        )
        
        print("\n✅ SUCCESS! Dashboard generated:")
        print(f"   - Tabs: {len(result.get('tabs', []))}")
        print(f"   - Modules: {len(result.get('modules', []))}")
        print(f"   - Page Title: {result.get('meta', {}).get('page_title', 'N/A')}")
        
        # Save response for inspection
        output_path = Path(__file__).parent / "test_openrouter_response.json"
        import json
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2)
        print(f"\n✓ Full response saved to: {output_path}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


async def test_factory_detection():
    """Test that AIClientFactory correctly detects OpenRouter keys."""
    print("\n" + "="*80)
    print("TEST 3: AIClientFactory Detection")
    print("="*80)
    
    api_key = "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"
    
    # Test detection
    provider = AIClientFactory.detect_provider(api_key)
    print(f"\n✓ Detected provider: {provider}")
    
    is_openrouter = AIClientFactory.is_openrouter_key(api_key)
    print(f"✓ Is OpenRouter key: {is_openrouter}")
    
    # Test client creation
    client = AIClientFactory.create_client(api_key)
    print(f"✓ Client type: {type(client).__name__}")
    print(f"✓ Client model: {client.model_name}")
    
    if provider == "openrouter" and is_openrouter and isinstance(client, OpenRouterClient):
        print("\n✅ Factory detection working correctly!")
        return True
    else:
        print("\n❌ Factory detection failed!")
        return False


async def main():
    """Run all tests."""
    print("\n" + "="*80)
    print("OPENROUTER INTEGRATION TEST SUITE")
    print("="*80)
    
    results = []
    
    # Test 1: Simple API call
    results.append(("Simple API Call", await test_openrouter_simple()))
    
    # Test 2: Factory detection
    results.append(("Factory Detection", await test_factory_detection()))
    
    # Test 3: Full startup analysis (most important)
    results.append(("Startup Analysis", await test_openrouter_with_startup_prompt()))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    for name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{status}: {name}")
    
    all_passed = all(result[1] for result in results)
    
    if all_passed:
        print("\n🎉 All tests passed! OpenRouter integration is working correctly.")
        print("\n📋 Next steps:")
        print("   1. Restart the FastAPI backend server")
        print("   2. Restart the Next.js frontend server")
        print("   3. Select 'TACO' in the frontend")
        print("   4. Generate a dashboard and verify it uses OpenRouter")
    else:
        print("\n⚠️  Some tests failed. Please review the errors above.")
    
    return all_passed


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
