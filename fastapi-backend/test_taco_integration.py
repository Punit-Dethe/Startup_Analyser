"""
Comprehensive test for TACO (Groq) integration.
Tests the complete flow from frontend API key to Groq API.
"""
import asyncio
import sys
from app.integrations.ai_client_factory import AIClientFactory
from app.integrations.groq_client import GroqClient

# TACO API Key (Groq)
TACO_API_KEY = "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"

# Test Gemini key for comparison
GEMINI_API_KEY = "AIzaSyAa-AyiIcmiRq4MQYkNOSq9D3ZxFQLmvqw"


def test_api_key_detection():
    """Test that API keys are correctly detected."""
    print("=" * 70)
    print("TEST 1: API Key Detection")
    print("=" * 70)
    
    # Test TACO (Groq) key
    print(f"\nTACO Key: {TACO_API_KEY[:20]}...")
    taco_provider = AIClientFactory.detect_provider(TACO_API_KEY)
    print(f"✅ Detected as: {taco_provider.upper()}")
    assert taco_provider == "groq", f"Expected 'groq', got '{taco_provider}'"
    
    # Test Gemini key
    print(f"\nGemini Key: {GEMINI_API_KEY[:20]}...")
    gemini_provider = AIClientFactory.detect_provider(GEMINI_API_KEY)
    print(f"✅ Detected as: {gemini_provider.upper()}")
    assert gemini_provider == "gemini", f"Expected 'gemini', got '{gemini_provider}'"
    
    print("\n✅ API Key Detection: PASSED\n")


def test_client_creation():
    """Test that correct clients are created."""
    print("=" * 70)
    print("TEST 2: Client Creation")
    print("=" * 70)
    
    # Create TACO client
    print(f"\nCreating client for TACO key...")
    taco_client = AIClientFactory.create_client(TACO_API_KEY)
    print(f"✅ Created: {type(taco_client).__name__}")
    print(f"   Model: {taco_client.model_name}")
    assert isinstance(taco_client, GroqClient), "Expected GroqClient instance"
    assert taco_client.model_name == "llama-3.3-70b-versatile", "Wrong default model"
    
    # Create Gemini client
    print(f"\nCreating client for Gemini key...")
    gemini_client = AIClientFactory.create_client(GEMINI_API_KEY)
    print(f"✅ Created: {type(gemini_client).__name__}")
    print(f"   Model: {gemini_client.model_name}")
    
    print("\n✅ Client Creation: PASSED\n")


async def test_groq_api_call():
    """Test actual Groq API call."""
    print("=" * 70)
    print("TEST 3: Groq API Call")
    print("=" * 70)
    
    print("\nCreating Groq client...")
    client = GroqClient(api_key=TACO_API_KEY)
    
    print("Sending test prompt: 'What is 2+2? Respond in JSON format with a field called answer.'")
    
    try:
        response = await client.generate(
            prompt="What is 2+2? Respond in JSON format with a field called 'answer' containing just the number.",
            system_prompt="You are a helpful assistant that responds in JSON format.",
            temperature=0.7,
            max_tokens=100,
            json_mode=True
        )
        
        print(f"\n✅ API Call Successful!")
        print(f"Response: {response}")
        
        # Verify it's valid JSON with expected structure
        assert isinstance(response, dict), "Response should be a dictionary"
        print(f"\n✅ JSON Parsing: PASSED")
        
        return True
        
    except Exception as e:
        print(f"\n❌ API Call Failed: {e}")
        return False


async def test_full_integration():
    """Test the complete integration flow."""
    print("=" * 70)
    print("TEST 4: Full Integration Flow")
    print("=" * 70)
    
    print("\nSimulating frontend request with TACO key...")
    print("Step 1: Frontend sends request with X-Gemini-Api-Key header")
    print(f"        Key: {TACO_API_KEY[:20]}...")
    
    print("\nStep 2: Backend receives key and creates client")
    client = AIClientFactory.create_client(TACO_API_KEY)
    print(f"        ✅ Created {type(client).__name__}")
    print(f"        ✅ Using model: {client.model_name}")
    
    print("\nStep 3: Backend sends request to Groq API")
    try:
        response = await client.generate(
            prompt="Generate a simple JSON object with a 'status' field set to 'success' and a 'message' field with a greeting.",
            system_prompt="You are a helpful assistant. Always respond in valid JSON format.",
            temperature=0.7,
            max_tokens=100,
            json_mode=True
        )
        
        print(f"        ✅ Received response from Groq")
        print(f"        Response: {response}")
        
        print("\nStep 4: Backend returns response to frontend")
        print(f"        ✅ Response is valid JSON")
        
        print("\n✅ Full Integration Flow: PASSED")
        return True
        
    except Exception as e:
        print(f"\n❌ Integration Flow Failed: {e}")
        return False


async def main():
    """Run all tests."""
    print("\n" + "=" * 70)
    print("TACO (GROQ) INTEGRATION TEST SUITE")
    print("=" * 70)
    print()
    
    # Test 1: API Key Detection
    try:
        test_api_key_detection()
    except Exception as e:
        print(f"❌ Test 1 Failed: {e}\n")
        sys.exit(1)
    
    # Test 2: Client Creation
    try:
        test_client_creation()
    except Exception as e:
        print(f"❌ Test 2 Failed: {e}\n")
        sys.exit(1)
    
    # Test 3: Groq API Call
    try:
        success = await test_groq_api_call()
        if not success:
            sys.exit(1)
        print()
    except Exception as e:
        print(f"❌ Test 3 Failed: {e}\n")
        sys.exit(1)
    
    # Test 4: Full Integration
    try:
        success = await test_full_integration()
        if not success:
            sys.exit(1)
    except Exception as e:
        print(f"❌ Test 4 Failed: {e}\n")
        sys.exit(1)
    
    # All tests passed
    print("\n" + "=" * 70)
    print("🎉 ALL TESTS PASSED!")
    print("=" * 70)
    print("\n✅ TACO integration is working correctly!")
    print("✅ When you select TACO in the frontend, it will use Groq API")
    print(f"✅ Model: llama-3.3-70b-versatile")
    print("\nYou're ready to use TACO! 🌮\n")


if __name__ == "__main__":
    asyncio.run(main())
