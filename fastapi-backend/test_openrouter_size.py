"""
Test OpenRouter with different prompt sizes to find the limit.
"""

import asyncio
from app.integrations.openrouter_client import OpenRouterClient


async def test_prompt_size(size_kb: int):
    """Test with a specific prompt size."""
    api_key = "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"
    model = "nvidia/nemotron-3-super-120b-a12b:free"
    
    client = OpenRouterClient(api_key=api_key, model=model)
    
    # Create a prompt of specific size
    system_prompt = "You are a helpful assistant that responds in JSON format." * (size_kb * 50)
    user_prompt = "Generate a JSON object with a 'status' field set to 'ok'."
    
    print(f"\nTesting {size_kb}KB prompt ({len(system_prompt)} chars)...")
    
    try:
        result = await client.generate(
            prompt=user_prompt,
            system_prompt=system_prompt,
            temperature=0.7,
            max_tokens=100,
            json_mode=True,
            timeout=60.0
        )
        print(f"✅ SUCCESS at {size_kb}KB")
        return True
    except Exception as e:
        print(f"❌ FAILED at {size_kb}KB: {e}")
        return False


async def main():
    """Test different sizes."""
    print("="*80)
    print("OPENROUTER PROMPT SIZE TEST")
    print("="*80)
    
    # Test increasing sizes
    sizes = [1, 5, 10, 20, 30, 40, 50]
    
    for size in sizes:
        success = await test_prompt_size(size)
        if not success:
            print(f"\n⚠️  Limit found: Between {sizes[sizes.index(size)-1] if size != sizes[0] else 0}KB and {size}KB")
            break
        await asyncio.sleep(2)  # Wait between requests


if __name__ == "__main__":
    asyncio.run(main())
