"""
Test script for Grok API (xAI) with deepseek-r1-distill-llama-70b model
"""
import os
import requests
import json

# Grok API configuration
GROK_API_KEY = "xai-xq2B2sEqk8JDXviPahWZYruhPXXwzNJVbwu8QSNj2En01uAqKXbGQfQZKXIfW0LLDehJTZfyiPmdcSUZ"
GROK_API_URL = "https://api.x.ai/v1/chat/completions"
MODEL = "deepseek-r1-distill-llama-70b"

def test_grok_api():
    """Test basic Grok API functionality"""
    
    print("=" * 60)
    print("Testing Grok API (xAI)")
    print("=" * 60)
    print(f"API URL: {GROK_API_URL}")
    print(f"Model: {MODEL}")
    print(f"API Key: {GROK_API_KEY[:20]}...")
    print()
    
    # Test payload
    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful AI assistant. Respond concisely."
            },
            {
                "role": "user",
                "content": "What is 2+2? Respond with just the number."
            }
        ],
        "temperature": 0.7,
        "max_tokens": 100
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GROK_API_KEY}"
    }
    
    try:
        print("Sending request to Grok API...")
        response = requests.post(
            GROK_API_URL,
            headers=headers,
            json=payload,
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print()
        
        if response.status_code == 200:
            result = response.json()
            print("✅ SUCCESS!")
            print()
            print("Response:")
            print(json.dumps(result, indent=2))
            print()
            
            # Extract the actual response
            if "choices" in result and len(result["choices"]) > 0:
                message = result["choices"][0].get("message", {})
                content = message.get("content", "")
                print("AI Response:")
                print(f"  {content}")
                print()
                
            # Show usage stats
            if "usage" in result:
                usage = result["usage"]
                print("Token Usage:")
                print(f"  Prompt tokens: {usage.get('prompt_tokens', 'N/A')}")
                print(f"  Completion tokens: {usage.get('completion_tokens', 'N/A')}")
                print(f"  Total tokens: {usage.get('total_tokens', 'N/A')}")
                
        else:
            print("❌ ERROR!")
            print(f"Status: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.Timeout:
        print("❌ Request timed out after 30 seconds")
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")

def test_grok_streaming():
    """Test Grok API with streaming"""
    
    print("\n" + "=" * 60)
    print("Testing Grok API Streaming")
    print("=" * 60)
    
    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "user",
                "content": "Count from 1 to 5, one number per line."
            }
        ],
        "stream": True,
        "temperature": 0.7
    }
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GROK_API_KEY}"
    }
    
    try:
        print("Sending streaming request...")
        response = requests.post(
            GROK_API_URL,
            headers=headers,
            json=payload,
            stream=True,
            timeout=30
        )
        
        if response.status_code == 200:
            print("✅ Streaming response:")
            print()
            
            for line in response.iter_lines():
                if line:
                    line_str = line.decode('utf-8')
                    if line_str.startswith('data: '):
                        data_str = line_str[6:]  # Remove 'data: ' prefix
                        if data_str.strip() == '[DONE]':
                            print("\n✅ Stream completed!")
                            break
                        try:
                            data = json.loads(data_str)
                            if "choices" in data and len(data["choices"]) > 0:
                                delta = data["choices"][0].get("delta", {})
                                content = delta.get("content", "")
                                if content:
                                    print(content, end="", flush=True)
                        except json.JSONDecodeError:
                            pass
        else:
            print(f"❌ Streaming failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Streaming error: {e}")

if __name__ == "__main__":
    # Test basic API call
    test_grok_api()
    
    # Test streaming
    test_grok_streaming()
    
    print("\n" + "=" * 60)
    print("Testing complete!")
    print("=" * 60)
