"""
Final test: OpenRouter with actual startup analysis prompt, no JSON mode.
"""

import asyncio
import json
from pathlib import Path
from app.integrations.openrouter_client import OpenRouterClient


async def main():
    """Test OpenRouter with startup analysis."""
    print("\n" + "="*80)
    print("OPENROUTER FINAL TEST - Startup Analysis")
    print("="*80)
    
    api_key = "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"
    model = "nvidia/nemotron-3-super-120b-a12b:free"
    
    # Load prompt
    prompt_path = Path(__file__).parent / "prompts" / "startupanalysis.md"
    with open(prompt_path, 'r', encoding='utf-8') as f:
        system_prompt = f.read()
    
    print(f"\n✓ Model: {model}")
    print(f"✓ System prompt: {len(system_prompt)} characters")
    
    client = OpenRouterClient(api_key=api_key, model=model)
    
    user_prompt = """Food delivery startup in India with ₹50L budget.

Focus on tier-2 cities with hyperlocal delivery model. Partner with local restaurants and home chefs. 
Revenue from delivery fees (₹30-50 per order) and restaurant commissions (15-20%). 
Target market: 18-35 year olds in cities like Indore, Jaipur, Lucknow."""
    
    print(f"✓ User prompt: {user_prompt[:80]}...")
    print("\n⏳ Sending request (may take 60-120 seconds)...")
    print("   Note: JSON mode disabled, will extract JSON from response\n")
    
    try:
        # Try WITHOUT JSON mode (some models don't support it)
        result = await client.generate(
            prompt=user_prompt,
            system_prompt=system_prompt,
            temperature=0.7,
            max_tokens=8192,
            json_mode=False,  # Disabled
            timeout=300.0
        )
        
        print("✅ SUCCESS! Dashboard generated:")
        print(f"   - Tabs: {len(result.get('tabs', []))}")
        print(f"   - Modules: {len(result.get('modules', []))}")
        print(f"   - Page Title: {result.get('meta', {}).get('page_title', 'N/A')}")
        
        # Save response
        output_path = Path(__file__).parent / "test_openrouter_success.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(result, f, indent=2)
        print(f"\n✓ Full response saved to: {output_path}")
        
        print("\n🎉 OpenRouter integration is working!")
        print("\n📋 Next steps:")
        print("   1. Restart FastAPI backend: python -m uvicorn app.main:app --reload")
        print("   2. Restart Next.js frontend: npm run dev")
        print("   3. Select 'TACO' in the frontend")
        print("   4. Generate a dashboard")
        
        return True
        
    except Exception as e:
        print(f"\n❌ FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = asyncio.run(main())
    exit(0 if success else 1)
