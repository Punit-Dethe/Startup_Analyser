"""
Test script to list available Grok models and test with grok-beta
"""
import requests
import json

GROK_API_KEY = "xai-xq2B2sEqk8JDXviPahWZYruhPXXwzNJVbwu8QSNj2En01uAqKXbGQfQZKXIfW0LLDehJTZfyiPmdcSUZ"

def list_models():
    """List available models from xAI"""
    print("=" * 60)
    print("Listing Available xAI Models")
    print("=" * 60)
    
    url = "https://api.x.ai/v1/models"
    headers = {
        "Authorization": f"Bearer {GROK_API_KEY}"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        print(f"Status Code: {response.status_code}\n")
        
        if response.status_code == 200:
            result = response.json()
            print("Available Models:")
            print(json.dumps(result, indent=2))
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

def test_with_grok_beta():
    """Test with grok-beta model"""
    print("\n" + "=" * 60)
    print("Testing with grok-beta model")
    print("=" * 60)
    
    url = "https://api.x.ai/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {GROK_API_KEY}"
    }
    
    payload = {
        "model": "grok-beta",
        "messages": [
            {"role": "user", "content": "What is 2+2?"}
        ],
        "temperature": 0.7,
        "max_tokens": 50
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        print(f"Status Code: {response.status_code}\n")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ SUCCESS!")
            print(json.dumps(result, indent=2))
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    list_models()
    test_with_grok_beta()
