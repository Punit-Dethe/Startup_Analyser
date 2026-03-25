"""Dependency injection for FastAPI."""

from functools import lru_cache

from app.config import settings
from app.integrations.gemini_client import GeminiClient
from app.services.prompt_service import PromptService
from app.services.generate_service import GenerateService
from app.services.chat_service import ChatService
from app.validation.dashboard_validator import DashboardValidator
from app.validation.chat_validator import ChatValidator


@lru_cache()
def get_gemini_client() -> GeminiClient:
    """Get Gemini client instance."""
    return GeminiClient(api_key=settings.GEMINI_API_KEY)


@lru_cache()
def get_prompt_service() -> PromptService:
    """Get prompt service instance."""
    return PromptService()


@lru_cache()
def get_dashboard_validator() -> DashboardValidator:
    """Get dashboard validator instance."""
    return DashboardValidator()


@lru_cache()
def get_chat_validator() -> ChatValidator:
    """Get chat validator instance."""
    return ChatValidator()


def get_generate_service(
    gemini_client: GeminiClient = None,
    prompt_service: PromptService = None,
    validator: DashboardValidator = None
) -> GenerateService:
    """Get generate service instance."""
    if gemini_client is None:
        gemini_client = get_gemini_client()
    if prompt_service is None:
        prompt_service = get_prompt_service()
    if validator is None:
        validator = get_dashboard_validator()
    
    return GenerateService(gemini_client, prompt_service, validator)


def get_chat_service(
    gemini_client: GeminiClient = None,
    prompt_service: PromptService = None,
    validator: ChatValidator = None
) -> ChatService:
    """Get chat service instance."""
    if gemini_client is None:
        gemini_client = get_gemini_client()
    if prompt_service is None:
        prompt_service = get_prompt_service()
    if validator is None:
        validator = get_chat_validator()
    
    return ChatService(gemini_client, prompt_service, validator)
