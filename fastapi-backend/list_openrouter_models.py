"""
List all available OpenRouter models.
"""

import asyncio
import httpx
import json


async def list_models(api_key: str):
    """List all available models from OpenRouter."""
    print("\n" + "="*80)
    print("OPENROUTER AVAILABLE MODELS")
    print("="*80)
    
    headers = {
        "Authorization": f"Bearer {api_key}",
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                "https://openrouter.ai/api/v1/models",
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                models = result.get("data", [])
                
                print(f"\n✓ Found {len(models)} models")
                
                # Filter for free models
                free_models = [m for m in models if m.get("pricing", {}).get("prompt", "0") == "0"]
                
                print(f"✓ Free models: {len(free_models)}")
                
                print("\n" + "="*80)
                print("FREE MODELS (sorted by context length)")
                print("="*80)
                
                # Sort by context length
                free_models.sort(key=lambda x: x.get("context_length", 0), reverse=True)
                
                for model in free_models[:20]:  # Show top 20
                    name = model.get("id", "Unknown")
                    context = model.get("context_length", 0)
                    description = model.get("description", "")[:60]
                    
                    print(f"\n{name}")
                    print(f"  Context: {context:,} tokens")
                    if description:
                        print(f"  {description}...")
                
                # Save full list
                output_path = "openrouter_models.json"
                with open(output_path, 'w') as f:
                    json.dump(models, f, indent=2)
                print(f"\n✓ Full model list saved to: {output_path}")
                
                return True
            else:
                print(f"❌ Failed to fetch models: {response.status_code}")
                print(response.text)
                return False
                
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False


async def main():
    api_key = "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"
    await list_models(api_key)


if __name__ == "__main__":
    asyncio.run(main())
