"""AI Client Factory for creating Gemini, Groq, or OpenRouter clients based on API key."""

import logging
from typing import Union

from app.integrations.gemini_client import GeminiClient
from app.integrations.groq_client import GroqClient
from app.integrations.openrouter_client import OpenRouterClient

logger = logging.getLogger("kore")


class AIClientFactory:
    """Factory for creating AI clients based on API key prefix."""
    
    # API key prefixes
    GEMINI_PREFIX = "AIzaSy"
    GROQ_PREFIX = "gsk_"
    OPENROUTER_PREFIX = "sk-or-v1-"
    
    # Default models
    DEFAULT_GEMINI_MODEL = "gemini-2.5-flash"
    DEFAULT_GROQ_MODEL = "llama-3.1-8b-instant"  # Faster model with higher token limits
    DEFAULT_OPENROUTER_MODEL = "nvidia/nemotron-3-super-120b-a12b:free"
    
    @classmethod
    def create_client(
        cls,
        api_key: str,
        model: str | None = None
    ) -> Union[GeminiClient, GroqClient, OpenRouterClient]:
        """
        Create appropriate AI client based on API key prefix.
        
        Args:
            api_key: API key (Gemini, Groq, or OpenRouter)
            model: Optional model override (if None, uses provider default)
            
        Returns:
            GeminiClient, GroqClient, or OpenRouterClient instance
            
        Raises:
            ValueError: Invalid API key format
        """
        # Detect provider from API key prefix
        if api_key.startswith(cls.OPENROUTER_PREFIX):
            provider = "openrouter"
            default_model = cls.DEFAULT_OPENROUTER_MODEL
        elif api_key.startswith(cls.GEMINI_PREFIX):
            provider = "gemini"
            default_model = cls.DEFAULT_GEMINI_MODEL
        elif api_key.startswith(cls.GROQ_PREFIX):
            provider = "groq"
            default_model = cls.DEFAULT_GROQ_MODEL
        else:
            raise ValueError(
                f"Invalid API key format. Must start with '{cls.GEMINI_PREFIX}' (Gemini), "
                f"'{cls.GROQ_PREFIX}' (Groq), or '{cls.OPENROUTER_PREFIX}' (OpenRouter)"
            )
        
        # Use provided model or default (CRITICAL: Don't pass None to client)
        selected_model = model if model is not None else default_model
        
        # Create appropriate client
        if provider == "openrouter":
            logger.info(f"Creating OpenRouter client with model: {selected_model}")
            return OpenRouterClient(api_key=api_key, model=selected_model)
        elif provider == "gemini":
            logger.info(f"Creating Gemini client with model: {selected_model}")
            return GeminiClient(api_key=api_key, model=selected_model)
        else:  # groq
            logger.info(f"Creating Groq client with model: {selected_model}")
            return GroqClient(api_key=api_key, model=selected_model)
    
    @classmethod
    def detect_provider(cls, api_key: str) -> str:
        """
        Detect AI provider from API key.
        
        Args:
            api_key: API key to check
            
        Returns:
            "gemini", "groq", or "openrouter"
            
        Raises:
            ValueError: Invalid API key format
        """
        if api_key.startswith(cls.OPENROUTER_PREFIX):
            return "openrouter"
        elif api_key.startswith(cls.GEMINI_PREFIX):
            return "gemini"
        elif api_key.startswith(cls.GROQ_PREFIX):
            return "groq"
        else:
            raise ValueError("Invalid API key format")
    
    @classmethod
    def is_gemini_key(cls, api_key: str) -> bool:
        """Check if API key is for Gemini."""
        return api_key.startswith(cls.GEMINI_PREFIX)
    
    @classmethod
    def is_groq_key(cls, api_key: str) -> bool:
        """Check if API key is for Groq."""
        return api_key.startswith(cls.GROQ_PREFIX)
    
    @classmethod
    def is_openrouter_key(cls, api_key: str) -> bool:
        """Check if API key is for OpenRouter."""
        return api_key.startswith(cls.OPENROUTER_PREFIX)
