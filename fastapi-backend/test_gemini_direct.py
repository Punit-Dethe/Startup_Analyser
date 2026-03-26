"""Test Gemini API directly to debug the message field issue."""
import asyncio
import json
from app.integrations.gemini_client import GeminiClient
from app.config import settings
from app.services.prompt_service import PromptService

async def test_direct():
    # Initialize client
    client = GeminiClient(settings.GEMINI_API_KEY)
    prompt_service = PromptService()
    
    # Load the chat prompt
    system_prompt = prompt_service.get_chat_prompt()
    
    # Create a simple user prompt for temporary tab
    user_prompt = """
Dashboard Context:
Subject: Discord Business Model Analysis
Active Tab: overview
Visible Modules:
  - chart.line (4x2): Monthly Active Users
  - metric.kpi (1x1): Revenue

Conversation History: (empty)

User Message: make a discord versus teams temporary tab
"""
    
    print("=" * 80)
    print("TESTING GEMINI DIRECT API CALL")
    print("=" * 80)
    print(f"\nModel: {client.model_name}")
    print(f"System Prompt Length: {len(system_prompt)} chars")
    print(f"User Prompt Length: {len(user_prompt)} chars")
    print("\n" + "=" * 80)
    print("CALLING GEMINI...")
    print("=" * 80)
    
    # Call Gemini
    response = await client.generate(
        prompt=user_prompt,
        system_prompt=system_prompt,
        temperature=0.2,
        max_tokens=8192,
        json_mode=True
    )
    
    print("\n" + "=" * 80)
    print("RESPONSE RECEIVED")
    print("=" * 80)
    print(f"\nAction: {response.get('action')}")
    print(f"\nMessage field length: {len(response.get('message', ''))} chars")
    print(f"\nMessage field content:")
    print("-" * 80)
    print(response.get('message', '')[:500])  # First 500 chars
    print("-" * 80)
    
    # Save full response to file
    with open('test_gemini_response.json', 'w', encoding='utf-8') as f:
        json.dump(response, f, indent=2, ensure_ascii=False)
    
    print("\n✅ Full response saved to: test_gemini_response.json")
    print("\n" + "=" * 80)

if __name__ == "__main__":
    asyncio.run(test_direct())
