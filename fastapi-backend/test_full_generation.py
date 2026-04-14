"""Test full dashboard generation with timing."""

import asyncio
import time
from app.dependencies import get_generate_service

async def test():
    print("Testing full dashboard generation...")
    print("This may take 2-5 minutes for complex prompts.\n")
    
    service = get_generate_service()
    
    start = time.time()
    try:
        result = await service.generate("Analyze Apple Inc")
        elapsed = time.time() - start
        
        print(f"✓ Generation successful in {elapsed:.1f} seconds!")
        print(f"  Subject: {result['dashboard']['meta']['subject']}")
        print(f"  Tabs: {len(result['dashboard']['tabs'])}")
        
    except Exception as e:
        elapsed = time.time() - start
        print(f"✗ Generation failed after {elapsed:.1f} seconds")
        print(f"  Error: {e}")

if __name__ == "__main__":
    asyncio.run(test())
