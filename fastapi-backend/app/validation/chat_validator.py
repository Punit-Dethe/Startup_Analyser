"""Chat response validation."""

import logging
from typing import Any

from app.utils.errors import ValidationError

logger = logging.getLogger("kore")


class ChatValidator:
    """Validator for chat responses."""
    
    def validate(self, response: dict[str, Any]) -> None:
        """
        Validate chat response structure.
        
        Args:
            response: Chat response to validate
            
        Raises:
            ValidationError: Validation failed
        """
        errors = []
        
        # Validate action field
        if "action" not in response:
            errors.append("Missing required field: action")
            raise ValidationError(f"Chat validation failed: {', '.join(errors)}")
        
        action = response["action"]
        valid_actions = ["CHAT", "NEW_DASHBOARD", "TEMPORARY_TAB"]
        
        if action not in valid_actions:
            errors.append(f"Invalid action: {action}. Must be one of {valid_actions}")
        
        # Validate action-specific fields
        if action == "CHAT":
            if "message" not in response or response["message"] is None:
                errors.append("CHAT action requires non-null message field")
        
        elif action == "NEW_DASHBOARD":
            if "message" not in response or response["message"] is None:
                errors.append("NEW_DASHBOARD action requires non-null message field")
            if "new_prompt" not in response or response["new_prompt"] is None:
                errors.append("NEW_DASHBOARD action requires non-null new_prompt field")
        
        elif action == "TEMPORARY_TAB":
            if "message" not in response or response["message"] is None:
                errors.append("TEMPORARY_TAB action requires non-null message field")
            if "tab" not in response or response["tab"] is None:
                errors.append("TEMPORARY_TAB action requires non-null tab field")
            if "modules" not in response or response["modules"] is None:
                errors.append("TEMPORARY_TAB action requires non-null modules field")
        
        if errors:
            logger.error(f"Chat validation failed: {errors}")
            raise ValidationError(f"Chat validation failed: {', '.join(errors)}")
        
        logger.info(f"Chat validation passed for action: {action}")
