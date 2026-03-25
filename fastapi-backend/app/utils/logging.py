"""Structured logging with sensitive data filtering."""

import logging
import json
import re
import uuid
from datetime import datetime
from typing import Any
from contextvars import ContextVar

# Context variable for request ID
request_id_var: ContextVar[str] = ContextVar("request_id", default="")


class SensitiveDataFilter(logging.Filter):
    """Filter to redact sensitive data from logs."""
    
    SENSITIVE_PATTERNS = [
        (re.compile(r'(api[_-]?key["\s:=]+)([^\s"]+)', re.IGNORECASE), r'\1***REDACTED***'),
        (re.compile(r'(authorization["\s:=]+bearer\s+)([^\s"]+)', re.IGNORECASE), r'\1***REDACTED***'),
        (re.compile(r'(token["\s:=]+)([^\s"]+)', re.IGNORECASE), r'\1***REDACTED***'),
        (re.compile(r'(password["\s:=]+)([^\s"]+)', re.IGNORECASE), r'\1***REDACTED***'),
    ]
    
    def filter(self, record: logging.LogRecord) -> bool:
        """Redact sensitive data from log record."""
        if hasattr(record, 'msg'):
            msg = str(record.msg)
            for pattern, replacement in self.SENSITIVE_PATTERNS:
                msg = pattern.sub(replacement, msg)
            record.msg = msg
        return True


class JSONFormatter(logging.Formatter):
    """Format log records as JSON."""
    
    def format(self, record: logging.LogRecord) -> str:
        """Format log record as JSON string."""
        log_data = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "level": record.levelname,
            "message": record.getMessage(),
            "logger": record.name,
        }
        
        # Add request ID if available
        request_id = request_id_var.get()
        if request_id:
            log_data["request_id"] = request_id
        
        # Add extra fields
        if hasattr(record, 'extra'):
            log_data.update(record.extra)
        
        # Add exception info if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
        
        return json.dumps(log_data)


def setup_logging(log_level: str = "INFO") -> logging.Logger:
    """
    Set up structured logging with JSON format.
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        
    Returns:
        Configured logger instance
    """
    logger = logging.getLogger("kore")
    logger.setLevel(log_level)
    
    # Remove existing handlers
    logger.handlers.clear()
    
    # Create console handler
    handler = logging.StreamHandler()
    handler.setLevel(log_level)
    
    # Add JSON formatter
    formatter = JSONFormatter()
    handler.setFormatter(formatter)
    
    # Add sensitive data filter
    handler.addFilter(SensitiveDataFilter())
    
    logger.addHandler(handler)
    
    return logger


def generate_request_id() -> str:
    """Generate a unique request ID."""
    return f"req_{uuid.uuid4().hex[:12]}"


def set_request_id(request_id: str) -> None:
    """Set request ID in context."""
    request_id_var.set(request_id)


def get_request_id() -> str:
    """Get current request ID from context."""
    return request_id_var.get()


def log_with_context(logger: logging.Logger, level: str, message: str, **kwargs: Any) -> None:
    """
    Log message with additional context.
    
    Args:
        logger: Logger instance
        level: Log level (debug, info, warning, error, critical)
        message: Log message
        **kwargs: Additional context fields
    """
    log_func = getattr(logger, level.lower())
    log_func(message, extra=kwargs)
