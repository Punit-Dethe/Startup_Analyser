"""Quick local test script to verify the backend works."""

import asyncio
import sys
from pathlib import Path

# Add app to path
sys.path.insert(0, str(Path(__file__).parent))

from app.config import settings
from app.dependencies import get_generate_service, get_chat_service
from app.models.requests import ChatMessage, DashboardContext, CompactModule


async def test_generate():
    """Test dashboard generation."""
    print("\n=== Testing Dashboard Generation ===")
    
    try:
        service = get_generate_service()
        result = await service.generate("Analyze Apple Inc")
        
        print(f"✓ Dashboard generated successfully!")
        print(f"  Subject: {result['dashboard']['meta']['subject']}")
        print(f"  Tabs: {len(result['dashboard']['tabs'])}")
        print(f"  Modules: {len(result['dashboard']['modules'])}")
        
        return True
    except Exception as e:
        print(f"✗ Generation failed: {e}")
        return False


async def test_chat():
    """Test chat interaction."""
    print("\n=== Testing Chat Interaction ===")
    
    try:
        service = get_chat_service()
        
        # Create mock context
        context = DashboardContext(
            subject="Apple Inc",
            active_tab="overview",
            visible_modules=[
                CompactModule(
                    id="mod_1",
                    type="metric.kpi",
                    size="1x1",
                    title="Revenue",
                    accent="brand",
                    value="$394.3B"
                )
            ]
        )
        
        result = await service.chat(
            message="What does this revenue number mean?",
            history=[],
            context=context
        )
        
        print(f"✓ Chat processed successfully!")
        print(f"  Action: {result['action']}")
        if result.get('message'):
            print(f"  Message length: {len(result['message'])} chars")
        
        return True
    except Exception as e:
        print(f"✗ Chat failed: {e}")
        return False


async def main():
    """Run all tests."""
    print("=" * 60)
    print("KORE FastAPI Backend - Local Test")
    print("=" * 60)
    
    # Check configuration
    print(f"\nConfiguration:")
    print(f"  Environment: {settings.ENVIRONMENT}")
    print(f"  Gemini API Key: {'✓ Configured' if settings.GEMINI_API_KEY else '✗ Missing'}")
    print(f"  Frontend URL: {settings.FRONTEND_URL}")
    
    if not settings.GEMINI_API_KEY:
        print("\n✗ GEMINI_API_KEY not configured!")
        print("  Please set it in .env file or environment variable")
        return
    
    # Run tests
    generate_ok = await test_generate()
    chat_ok = await test_chat()
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary:")
    print(f"  Dashboard Generation: {'✓ PASS' if generate_ok else '✗ FAIL'}")
    print(f"  Chat Interaction: {'✓ PASS' if chat_ok else '✗ FAIL'}")
    print("=" * 60)
    
    if generate_ok and chat_ok:
        print("\n🎉 All tests passed! Backend is ready to use.")
    else:
        print("\n⚠️  Some tests failed. Check the errors above.")


if __name__ == "__main__":
    asyncio.run(main())
