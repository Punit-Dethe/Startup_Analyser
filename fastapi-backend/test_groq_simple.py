"""Simple test to debug Groq integration issue."""
import asyncio
import sys
import traceback

# Add app to path
sys.path.insert(0, '.')

from app.integrations.ai_client_factory import AIClientFactory

GROQ_KEY = "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"

async def test_simple_generation():
    """Test simple dashboard generation with Groq."""
    print("=" * 70)
    print("Testing Groq Dashboard Generation")
    print("=" * 70)
    
    try:
        # Create client
        print("\n1. Creating Groq client...")
        client = AIClientFactory.create_client(GROQ_KEY)
        print(f"   ✓ Created: {type(client).__name__}")
        print(f"   ✓ Model: {client.model_name}")
        
        # Simple prompt
        print("\n2. Sending simple prompt...")
        system_prompt = """You are a dashboard generator. Generate a simple JSON response with this structure:
{
  "meta": {
    "subject": "Test Company",
    "mode": "company"
  },
  "tabs": [
    {"id": "overview", "label": "Overview"}
  ],
  "modules": [
    {
      "id": "mod1",
      "tab": "overview",
      "type": "metric.kpi",
      "size": "1x1",
      "accent": "primary",
      "data": {
        "title": "Revenue",
        "value": "$1M",
        "delta": "+10%",
        "direction": "up"
      }
    }
  ]
}"""
        
        user_prompt = "Generate a simple dashboard for Test Company"
        
        response = await client.generate(
            prompt=user_prompt,
            system_prompt=system_prompt,
            temperature=0.7,
            max_tokens=2000,
            json_mode=True
        )
        
        print(f"   ✓ Response received!")
        print(f"   ✓ Type: {type(response)}")
        print(f"   ✓ Keys: {list(response.keys())}")
        
        # Check structure
        if "meta" in response:
            print(f"   ✓ Has 'meta' field")
        if "tabs" in response:
            print(f"   ✓ Has 'tabs' field ({len(response['tabs'])} tabs)")
        if "modules" in response:
            print(f"   ✓ Has 'modules' field ({len(response['modules'])} modules)")
        
        print("\n✅ Test PASSED!")
        print("\nFull response:")
        import json
        print(json.dumps(response, indent=2))
        
        return True
        
    except Exception as e:
        print(f"\n❌ Test FAILED!")
        print(f"Error: {e}")
        print("\nFull traceback:")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_simple_generation())
    sys.exit(0 if success else 1)
