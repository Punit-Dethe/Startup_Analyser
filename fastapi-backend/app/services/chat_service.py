"""Chat interaction service."""

import logging
from typing import Any

from app.integrations.gemini_client import GeminiClient
from app.services.prompt_service import PromptService
from app.validation.chat_validator import ChatValidator
from app.models.requests import ChatMessage, DashboardContext
from app.utils.errors import ServiceError

logger = logging.getLogger("kore")


class ChatService:
    """Service for chat interaction orchestration."""
    
    def __init__(
        self,
        gemini_client: GeminiClient,
        prompt_service: PromptService,
        validator: ChatValidator
    ):
        """Initialize with dependencies."""
        self.gemini_client = gemini_client
        self.prompt_service = prompt_service
        self.validator = validator
    
    async def chat(
        self,
        message: str,
        history: list[ChatMessage],
        context: DashboardContext,
        api_key: str | None = None
    ) -> dict[str, Any]:
        """
        Process chat message and generate response.
        
        Args:
            message: User's message
            history: Conversation history
            context: Current dashboard context
            api_key: Optional custom Gemini API key (overrides default)
            
        Returns:
            ChatResponse dict with action and data
            
        Raises:
            ServiceError: Chat processing failed
        """
        try:
            # Reconfigure client with custom API key if provided
            if api_key:
                self.gemini_client.reconfigure(api_key)
            
            # Load system prompt
            system_prompt = self.prompt_service.get_chat_prompt()
            logger.info(f"Processing chat message: {message[:100]}")
            
            # Format conversation history
            history_text = self._format_history(history)
            
            # Format dashboard context
            context_text = self._format_context(context)
            
            # Build user prompt
            user_prompt = f"""
{context_text}

{history_text}

User Message: {message}
"""
            
            # Call Gemini API with retry
            response = await self.gemini_client.generate_with_retry(
                prompt=user_prompt,
                system_prompt=system_prompt,
                temperature=0.7,
                max_tokens=8192,
                json_mode=True
            )
            
            # Validate response
            self.validator.validate(response)
            
            logger.info(f"Chat processing completed with action: {response.get('action')}")
            return response
            
        except Exception as e:
            logger.error(f"Chat processing failed: {e}")
            raise ServiceError(f"Failed to process chat: {str(e)}")
    
    def _format_history(self, history: list[ChatMessage]) -> str:
        """Format conversation history for prompt."""
        if not history:
            return "Conversation History: (empty)"
        
        formatted = ["Conversation History:"]
        for msg in history:
            role = "User" if msg.role == "user" else "Assistant"
            formatted.append(f"{role}: {msg.content}")
        
        return "\n".join(formatted)
    
    def _format_context(self, context: DashboardContext) -> str:
        """Format dashboard context for prompt."""
        modules_text = []
        for module in context.visible_modules:
            modules_text.append(
                f"  - {module.type} ({module.size}): {module.title or 'Untitled'}"
            )
        
        return f"""Dashboard Context:
Subject: {context.subject}
Active Tab: {context.active_tab}
Visible Modules:
{chr(10).join(modules_text)}"""
