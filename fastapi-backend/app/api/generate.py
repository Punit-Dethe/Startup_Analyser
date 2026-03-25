"""Generate endpoint for dashboard creation."""

import logging
import asyncio
from fastapi import APIRouter, HTTPException, status, Header
from typing import Optional

from app.models.requests import GenerateRequest
from app.dependencies import get_generate_service
from app.utils.logging import get_request_id
from app.utils.errors import GeminiAPIError, GeminiRateLimitError, ValidationError

logger = logging.getLogger("kore")
router = APIRouter()


@router.post("/generate")
async def generate_dashboard(
    request: GenerateRequest,
    x_gemini_api_key: Optional[str] = Header(None)
):
    """
    Generate a complete dashboard from a user query.
    
    Args:
        request: Generate request with query field
        x_gemini_api_key: Optional custom Gemini API key from header
        
    Returns:
        GenerateResponse with dashboard, dashboard_state, and generated_at
        
    Raises:
        HTTPException: 400 for validation errors, 500 for generation errors, 503 for service unavailable
    """
    try:
        # Get service
        service = get_generate_service()
        
        # Generate dashboard with timeout (3 minutes for complex queries)
        result = await asyncio.wait_for(
            service.generate(request.query, api_key=x_gemini_api_key),
            timeout=180.0
        )
        
        return result
        
    except asyncio.TimeoutError:
        logger.error("Dashboard generation timed out")
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
                "error": f"Dashboard validation failed: {e.message}",
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
                "error": f"Failed to generate dashboard: {e.message}",
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
