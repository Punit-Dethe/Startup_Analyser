"""Dependency injection for FastAPI."""

from functools import lru_cache
from typing import Union

from app.config import settings
from app.integrations.gemini_client import GeminiClient
from app.integrations.groq_client import GroqClient
from app.integrations.openrouter_client import OpenRouterClient
from app.integrations.ai_client_factory import AIClientFactory
from app.services.prompt_service import PromptService
from app.services.generate_service import GenerateService
from app.services.chat_service import ChatService
from app.validation.dashboard_validator import DashboardValidator
from app.validation.chat_validator import ChatValidator


@lru_cache()
def get_default_ai_client() -> Union[GeminiClient, GroqClient, OpenRouterClient]:
    """
    Get default AI client instance based on configured API key.
    Automatically detects whether to use Gemini, Groq, or OpenRouter based on key prefix.
    """
    return AIClientFactory.create_client(api_key=settings.GEMINI_API_KEY)


# Backward compatibility alias
def get_gemini_client() -> Union[GeminiClient, GroqClient, OpenRouterClient]:
    """Get AI client instance (Gemini, Groq, or OpenRouter based on API key)."""
    return get_default_ai_client()


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
    ai_client: Union[GeminiClient, GroqClient, OpenRouterClient] = None,
    prompt_service: PromptService = None,
    validator: DashboardValidator = None
) -> GenerateService:
    """Get generate service instance."""
    if ai_client is None:
        ai_client = get_default_ai_client()
    if prompt_service is None:
        prompt_service = get_prompt_service()
    if validator is None:
        validator = get_dashboard_validator()
    
    return GenerateService(ai_client, prompt_service, validator)


def get_chat_service(
    ai_client: Union[GeminiClient, GroqClient, OpenRouterClient] = None,
    prompt_service: PromptService = None,
    validator: ChatValidator = None
) -> ChatService:
    """Get chat service instance."""
    if ai_client is None:
        ai_client = get_default_ai_client()
    if prompt_service is None:
        prompt_service = get_prompt_service()
    if validator is None:
        validator = get_chat_validator()
    
    return ChatService(ai_client, prompt_service, validator)

