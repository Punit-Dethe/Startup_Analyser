"""
Test script for Groq API with deepseek-r1-distill-llama-70b model
"""
import os
from groq import Groq

# Set the API key
GROQ_API_KEY = "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"
os.environ["GROQ_API_KEY"] = GROQ_API_KEY

def list_available_models():
    """List all available models on Groq"""
    print("=" * 60)
    print("Listing Available Groq Models")
    print("=" * 60)
    
    try:
        client = Groq(api_key=GROQ_API_KEY)
        models = client.models.list()
        
        print("\nAvailable Models:")
        print("-" * 60)
        for model in models.data:
            print(f"  • {model.id}")
            if hasattr(model, 'owned_by'):
                print(f"    Owner: {model.owned_by}")
            print()
        
        return [model.id for model in models.data]
        
    except Exception as e:
        print(f"❌ Error listing models: {e}")
        return []

def test_groq_chat(model_name="deepseek-r1-distill-llama-70b"):
    """Test Groq chat completion"""
    print("=" * 60)
    print(f"Testing Groq API with {model_name}")
    print("=" * 60)
    
    try:
        client = Groq(api_key=GROQ_API_KEY)
        
        print("\nSending test message: 'What is 2+2?'")
        print("-" * 60)
        
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": "What is 2+2? Respond with just the number and a brief explanation.",
                }
            ],
            model=model_name,
            temperature=0.7,
            max_tokens=100,
        )
        
        print("\n✅ SUCCESS!")
        print("-" * 60)
        print(f"Model: {chat_completion.model}")
        print(f"Response:")
        print(f"  {chat_completion.choices[0].message.content}")
        print()
        
        # Show usage stats
        if hasattr(chat_completion, 'usage'):
            usage = chat_completion.usage
            print("Token Usage:")
            print(f"  Prompt tokens: {usage.prompt_tokens}")
            print(f"  Completion tokens: {usage.completion_tokens}")
            print(f"  Total tokens: {usage.total_tokens}")
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        return False

def test_groq_streaming(model_name="deepseek-r1-distill-llama-70b"):
    """Test Groq streaming"""
    print("\n" + "=" * 60)
    print(f"Testing Groq Streaming with {model_name}")
    print("=" * 60)
    
    try:
        client = Groq(api_key=GROQ_API_KEY)
        
        print("\nSending streaming request: 'Count from 1 to 5'")
        print("-" * 60)
        print("Response: ", end="", flush=True)
        
        stream = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": "Count from 1 to 5, one number per line.",
                }
            ],
            model=model_name,
            temperature=0.7,
            max_tokens=100,
            stream=True,
        )
        
        for chunk in stream:
            if chunk.choices[0].delta.content:
                print(chunk.choices[0].delta.content, end="", flush=True)
        
        print("\n\n✅ Streaming completed!")
        return True
        
    except Exception as e:
        print(f"\n❌ Streaming error: {e}")
        return False

if __name__ == "__main__":
    # List available models
    available_models = list_available_models()
    
    # Test with deepseek-r1-distill-llama-70b
    model_to_test = "deepseek-r1-distill-llama-70b"
    
    if available_models:
        if model_to_test in available_models:
            print(f"\n✅ Model '{model_to_test}' is available!")
        else:
            print(f"\n⚠️  Model '{model_to_test}' not found in available models.")
            print(f"Available models: {', '.join(available_models[:5])}...")
            
            # Try to find a similar model
            deepseek_models = [m for m in available_models if 'deepseek' in m.lower()]
            if deepseek_models:
                print(f"\nDeepSeek models found: {', '.join(deepseek_models)}")
                model_to_test = deepseek_models[0]
                print(f"Will test with: {model_to_test}")
    
    print()
    
    # Test basic chat
    success = test_groq_chat(model_to_test)
    
    # Test streaming if basic chat worked
    if success:
        test_groq_streaming(model_to_test)
    
    print("\n" + "=" * 60)
    print("Testing complete!")
    print("=" * 60)
