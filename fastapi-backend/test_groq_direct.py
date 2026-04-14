"""Direct test of Groq API with actual startup analysis prompt."""
import asyncio
import sys
import json

sys.path.insert(0, '.')

from app.integrations.groq_client import GroqClient
from app.services.prompt_service import PromptService

GROQ_KEY = "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"

async def test_direct():
    """Test Groq with actual startup analysis prompt."""
    print("=" * 70)
    print("Direct Groq API Test with Startup Analysis Prompt")
    print("=" * 70)
    
    # Create client with llama-3.1-8b-instant
    print("\n1. Creating Groq client...")
    client = GroqClient(api_key=GROQ_KEY, model="llama-3.1-8b-instant")
    print(f"   ✓ Model: {client.model_name}")
    
    # Load actual prompt
    print("\n2. Loading startup analysis prompt...")
    prompt_service = PromptService()
    system_prompt = prompt_service.get_prompt("prompts/startupanalysis.md")
    print(f"   ✓ Prompt loaded: {len(system_prompt)} characters")
    
    # Simple query
    user_query = "Analyze ChargeConnect - an EV charging infrastructure startup in India"
    print(f"\n3. Query: {user_query}")
    
    # Try with llama-3.1-8b-instant
    print(f"\n4. Sending to Groq API (model: llama-3.1-8b-instant)...")
    try:
        response = await client.generate(
            prompt=f"User Query: {user_query}",
            system_prompt=system_prompt,
            temperature=0.7,
            max_tokens=16384,
            json_mode=True,
            timeout=120.0
        )
        
        print("\n✅ SUCCESS with llama-3.1-8b-instant!")
        print(f"\nResponse structure:")
        print(f"  - Has 'meta': {('meta' in response)}")
        print(f"  - Has 'tabs': {('tabs' in response)} ({len(response.get('tabs', []))} tabs)")
        print(f"  - Has 'modules': {('modules' in response)} ({len(response.get('modules', []))} modules)")
        
        if 'meta' in response:
            print(f"\nMeta:")
            print(f"  - Subject: {response['meta'].get('subject')}")
            print(f"  - Mode: {response['meta'].get('mode')}")
        
        if 'tabs' in response:
            print(f"\nTabs:")
            for tab in response['tabs']:
                print(f"  - {tab.get('label')} (id: {tab.get('id')})")
        
        print(f"\n✅ llama-3.1-8b-instant works!")
        return True
        
    except Exception as e:
        print(f"\n❌ FAILED with llama-3.1-8b-instant")
        print(f"Error: {e}")
        
        # Try with llama-3.3-70b-versatile to see the error
        print(f"\n5. Trying llama-3.3-70b-versatile to see the limit error...")
        client2 = GroqClient(api_key=GROQ_KEY, model="llama-3.3-70b-versatile")
        try:
            response2 = await client2.generate(
                prompt=f"User Query: {user_query}",
                system_prompt=system_prompt,
                temperature=0.7,
                max_tokens=16384,
                json_mode=True,
                timeout=120.0
            )
            print("\n✅ llama-3.3-70b-versatile also works!")
            return True
        except Exception as e2:
            print(f"\n❌ llama-3.3-70b-versatile error:")
            print(f"Error: {e2}")
            return False

if __name__ == "__main__":
    success = asyncio.run(test_direct())
    sys.exit(0 if success else 1)
