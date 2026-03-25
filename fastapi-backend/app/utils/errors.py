"""Custom exception classes for the application."""

from typing import Any


class KoreBaseException(Exception):
    """Base exception for all KORE backend errors."""
    
    def __init__(self, message: str, request_id: str | None = None, details: dict[str, Any] | None = None):
        self.message = message
        self.request_id = request_id
        self.details = details or {}
        super().__init__(self.message)


class GeminiAPIError(KoreBaseException):
    """Raised when Gemini API request fails."""
    pass


class GeminiRateLimitError(GeminiAPIError):
    """Raised when Gemini API rate limit is exceeded."""
    
    def __init__(self, message: str, retry_after: int | None = None, **kwargs):
        super().__init__(message, **kwargs)
        self.retry_after = retry_after


class GeminiParseError(GeminiAPIError):
    """Raised when Gemini API response cannot be parsed as JSON."""
    pass


class ValidationError(KoreBaseException):
    """Raised when response validation fails."""
    pass


class ServiceError(KoreBaseException):
    """Raised when a service operation fails."""
    pass


class PromptNotFoundError(KoreBaseException):
    """Raised when a system prompt file is not found."""
    pass


class ConfigurationError(KoreBaseException):
    """Raised when configuration is invalid or missing."""
    pass
