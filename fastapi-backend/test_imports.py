"""Quick test to verify all imports work correctly."""

import sys
import traceback

def test_imports():
    """Test that all modules can be imported."""
    errors = []
    
    modules_to_test = [
        "app.config",
        "app.utils.logging",
        "app.utils.errors",
        "app.models.requests",
        "app.models.responses",
        "app.models.dashboard",
        "app.integrations.gemini_client",
        "app.services.prompt_service",
        "app.services.generate_service",
        "app.services.chat_service",
        "app.validation.dashboard_validator",
        "app.validation.chat_validator",
        "app.dependencies",
        "app.api.health",
        "app.api.generate",
        "app.api.chat",
        "app.main",
    ]
    
    print("Testing imports...")
    for module in modules_to_test:
        try:
            __import__(module)
            print(f"✓ {module}")
        except Exception as e:
            error_msg = f"✗ {module}: {str(e)}"
            print(error_msg)
            errors.append(error_msg)
            traceback.print_exc()
    
    if errors:
        print(f"\n❌ {len(errors)} import(s) failed:")
        for error in errors:
            print(f"  {error}")
        sys.exit(1)
    else:
        print(f"\n✅ All {len(modules_to_test)} imports successful!")
        sys.exit(0)

if __name__ == "__main__":
    test_imports()
