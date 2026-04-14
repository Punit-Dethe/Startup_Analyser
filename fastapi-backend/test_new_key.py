"""Quick test of the new Gemini API key."""
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"Testing API key: {api_key[:20]}...")

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    response = model.generate_content("Say 'API key works!' in 3 words")
    print(f"\n✅ Success! Response: {response.text}")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
