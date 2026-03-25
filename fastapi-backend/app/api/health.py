"""Health check endpoint."""

from datetime import datetime
from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.config import settings
from app import __version__

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring and load balancers.
    
    Returns:
        Health status with timestamp and configuration info
    """
    gemini_configured = bool(settings.GEMINI_API_KEY)
    
    if not gemini_configured:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "error": "Gemini API key not configured"
            }
        )
    
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "version": __version__,
        "gemini_configured": gemini_configured
    }
