"""Test if the Gemini API key works with a minimal request."""

import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load environment
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"Testing API Key: {api_key[:20]}...")

# Configure
genai.configure(api_key=api_key)

# Try a simple request
try:
    model = genai.GenerativeModel("gemini-2.5-flash")
    print("\nSending minimal test request...")
    
    response = model.generate_content("Say 'Hello World' in JSON format: {\"message\": \"...\"}")
    
    print("✓ API Key works!")
    print(f"Response: {response.text}")
    
except Exception as e:
    print(f"✗ API Key failed: {e}")
