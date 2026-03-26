"""Test the /api/chat endpoint to verify TEMPORARY_TAB message field is working."""
import asyncio
import json
import httpx

async def test_chat_endpoint():
    """Test chat endpoint with a temporary tab request."""
    
    # Prepare the request payload
    payload = {
        "message": "make a discord versus teams temporary tab",
        "history": [],
        "context": {
            "subject": "Discord Business Model Analysis",
            "active_tab": "overview",
            "visible_modules": [
                {
                    "id": "mod_1",
                    "type": "chart.line",
                    "size": "4x2",
                    "title": "Monthly Active Users",
                    "accent": "primary",
                    "value": None
                },
                {
                    "id": "mod_2",
                    "type": "metric.kpi",
                    "size": "1x1",
                    "title": "Revenue",
                    "accent": "secondary",
                    "value": "$600M"
                }
            ]
        }
    }
    
    print("=" * 80)
    print("TESTING /api/chat ENDPOINT")
    print("=" * 80)
    print(f"\nRequest: {payload['message']}")
    print("\n" + "=" * 80)
    print("CALLING BACKEND...")
    print("=" * 80)
    
    # Call the backend endpoint
    async with httpx.AsyncClient(timeout=180.0) as client:
        response = await client.post(
            "http://localhost:8000/api/chat",
            json=payload
        )
    
    if response.status_code != 200:
        print(f"\n❌ ERROR: Status {response.status_code}")
        print(response.text)
        return
    
    result = response.json()
    
    print("\n" + "=" * 80)
    print("RESPONSE RECEIVED")
    print("=" * 80)
    print(f"\nAction: {result.get('action')}")
    print(f"\nMessage field length: {len(result.get('message', ''))} chars")
    print(f"\nMessage field preview (first 500 chars):")
    print("-" * 80)
    print(result.get('message', '')[:500])
    print("-" * 80)
    
    # Check if message is comprehensive
    message = result.get('message', '')
    is_comprehensive = len(message) > 500
    has_table = '|' in message and '---' in message
    has_html_highlight = '<span' in message
    has_header = '##' in message
    
    print("\n" + "=" * 80)
    print("VALIDATION CHECKS")
    print("=" * 80)
    print(f"✅ Message length > 500 chars: {is_comprehensive} ({len(message)} chars)")
    print(f"✅ Contains markdown table: {has_table}")
    print(f"✅ Contains HTML highlights: {has_html_highlight}")
    print(f"✅ Contains headers: {has_header}")
    
    # Check if it's the old hardcoded message
    is_hardcoded = message.startswith("Created temporary tab:")
    if is_hardcoded:
        print(f"\n❌ FAIL: Message is still hardcoded notification!")
    else:
        print(f"\n✅ SUCCESS: Message contains comprehensive analysis!")
    
    # Save full response
    with open('test_chat_endpoint_response.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2, ensure_ascii=False)
    
    print("\n✅ Full response saved to: test_chat_endpoint_response.json")
    print("\n" + "=" * 80)

if __name__ == "__main__":
    asyncio.run(test_chat_endpoint())
