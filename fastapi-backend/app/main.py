"""FastAPI application initialization and middleware."""

import logging
import time
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.config import settings
from app.utils.logging import setup_logging, generate_request_id, set_request_id, get_request_id
from app.utils.errors import KoreBaseException
from app import __version__

# Setup logging
logger = setup_logging(settings.LOG_LEVEL)

# Initialize FastAPI app
app = FastAPI(
    title="KORE Dashboard API",
    version=__version__,
    description="FastAPI backend for KORE dashboard with direct Gemini API integration"
)

# CORS middleware - allow frontend origins
# In production, allow all origins temporarily for testing
# TODO: Restrict to specific frontend URL after testing
allowed_origins = ["*"] if settings.is_production else [settings.FRONTEND_URL]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_logging_middleware(request: Request, call_next):
    """Log all incoming requests."""
    request_id = generate_request_id()
    set_request_id(request_id)
    
    # Log request start
    logger.info(
        f"Request started: {request.method} {request.url.path}",
        extra={
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "client": request.client.host if request.client else None
        }
    )
    
    start_time = time.time()
    
    # Process request
    response = await call_next(request)
    
    # Log request end
    duration_ms = (time.time() - start_time) * 1000
    logger.info(
        f"Request completed: {request.method} {request.url.path}",
        extra={
            "request_id": request_id,
            "status_code": response.status_code,
            "duration_ms": round(duration_ms, 2)
        }
    )
    
    # Add request ID to response headers
    response.headers["X-Request-ID"] = request_id
    
    return response


@app.middleware("http")
async def security_headers_middleware(request: Request, call_next):
    """Add security headers to all responses."""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response


@app.middleware("http")
async def request_size_middleware(request: Request, call_next):
    """Validate request body size (max 1MB)."""
    content_length = request.headers.get("content-length")
    if content_length and int(content_length) > 1_048_576:  # 1MB
        return JSONResponse(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            content={
                "error": "Request body too large (max 1MB)",
                "request_id": get_request_id()
            }
        )
    return await call_next(request)


@app.exception_handler(KoreBaseException)
async def kore_exception_handler(request: Request, exc: KoreBaseException):
    """Handle custom KORE exceptions."""
    logger.error(f"KORE exception: {exc.message}", extra={"request_id": exc.request_id})
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": exc.message,
            "request_id": exc.request_id or get_request_id(),
            "details": exc.details if settings.is_development else None
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors."""
    logger.warning(f"Validation error: {exc.errors()}")
    
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "error": "Validation error",
            "request_id": get_request_id(),
            "details": exc.errors() if settings.is_development else None
        }
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal server error",
            "request_id": get_request_id(),
            "details": str(exc) if settings.is_development else None
        }
    )


# Import and register routers
from app.api import health, generate, chat

app.include_router(health.router, tags=["health"])
app.include_router(generate.router, prefix="/api", tags=["generate"])
app.include_router(chat.router, prefix="/api", tags=["chat"])


@app.on_event("startup")
async def startup_event():
    """Run on application startup."""
    logger.info(f"Starting KORE Dashboard API v{__version__}")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Frontend URL: {settings.FRONTEND_URL}")
    logger.info(f"Gemini API configured: {bool(settings.GEMINI_API_KEY)}")


@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown."""
    logger.info("Shutting down KORE Dashboard API")
