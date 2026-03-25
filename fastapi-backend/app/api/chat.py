"""Chat endpoint for conversational interactions."""

import logging
import asyncio
from fastapi import APIRouter, HTTPException, status

from app.models.requests import ChatRequest
from app.dependencies import get_chat_service
from app.utils.logging import get_request_id
from app.utils.errors import GeminiAPIError, GeminiRateLimitError, ValidationError

logger = logging.getLogger("kore")
router = APIRouter()


@router.post("/chat")
async def chat(request: ChatRequest):
    """
    Handle conversational interactions with the dashboard.
    
    Args:
        request: Chat request with message, history, and context
        
    Returns:
        ChatResponse with action (CHAT, NEW_DASHBOARD, or TEMPORARY_TAB) and data
        
    Raises:
        HTTPException: 400 for validation errors, 500 for processing errors, 503 for service unavailable
    """
    try:
        # Get service
        service = get_chat_service()
        
        # Process chat with timeout (3 minutes for complex responses)
        result = await asyncio.wait_for(
            service.chat(request.message, request.history, request.context),
            timeout=180.0
        )
        
        return result
        
    except asyncio.TimeoutError:
        logger.error("Chat processing timed out")
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail={
                "error": "Request timed out after 3 minutes",
                "request_id": get_request_id()
            }
        )
    
    except ValidationError as e:
        logger.error(f"Validation error: {e.message}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": f"Chat response validation failed: {e.message}",
                "request_id": get_request_id()
            }
        )
    
    except GeminiRateLimitError as e:
        logger.warning(f"Rate limit exceeded: {e.message}")
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": "Rate limit exceeded",
                "request_id": get_request_id(),
                "retry_after": e.retry_after
            }
        )
    
    except GeminiAPIError as e:
        logger.error(f"Gemini API error: {e.message}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": f"Failed to process chat: {e.message}",
                "request_id": get_request_id()
            }
        )
    
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "Internal server error",
                "request_id": get_request_id()
            }
        )
