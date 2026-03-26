"""Dashboard generation service."""

import logging
from datetime import datetime
from typing import Any

from app.integrations.gemini_client import GeminiClient
from app.services.prompt_service import PromptService
from app.validation.dashboard_validator import DashboardValidator
from app.models.responses import GenerateResponse, CompactState, CompactTab, CompactModule
from app.utils.errors import ServiceError

logger = logging.getLogger("kore")


class GenerateService:
    """Service for dashboard generation orchestration."""
    
    def __init__(
        self,
        gemini_client: GeminiClient,
        prompt_service: PromptService,
        validator: DashboardValidator
    ):
        """Initialize with dependencies."""
        self.gemini_client = gemini_client
        self.prompt_service = prompt_service
        self.validator = validator
    
    async def generate(self, query: str, api_key: str | None = None) -> dict[str, Any]:
        """
        Generate complete dashboard from user query.
        
        Args:
            query: User's natural language query
            api_key: Optional custom Gemini API key (overrides default)
            
        Returns:
            GenerateResponse dict with dashboard and metadata
            
        Raises:
            ServiceError: Generation failed
        """
        try:
            # Reconfigure client with custom API key if provided
            if api_key:
                self.gemini_client.reconfigure(api_key)
            
            # Load system prompt
            system_prompt = self.prompt_service.get_generate_prompt()
            logger.info(f"Generating dashboard for query: {query[:100]}")
            
            # Format user prompt
            user_prompt = f"User Query: {query}"
            
            # Call Gemini API with retry
            response = await self.gemini_client.generate_with_retry(
                prompt=user_prompt,
                system_prompt=system_prompt,
                temperature=0.2,  # LOW temperature for strict instruction following
                max_tokens=16384,  # Increased for large dashboards
                json_mode=True
            )
            
            # Extract dashboard from response
            dashboard = response
            
            # Validate dashboard structure
            self.validator.validate(dashboard)
            
            # Create dashboard state (compact summary)
            dashboard_state = self._create_dashboard_state(dashboard)
            
            # Build response
            result = {
                "dashboard": dashboard,
                "dashboard_state": dashboard_state,
                "generated_at": datetime.utcnow().isoformat() + "Z"
            }
            
            logger.info("Dashboard generation completed successfully")
            return result
            
        except Exception as e:
            logger.error(f"Dashboard generation failed: {e}")
            raise ServiceError(f"Failed to generate dashboard: {str(e)}")
    
    def _create_dashboard_state(self, dashboard: dict[str, Any]) -> dict[str, Any]:
        """Create compact dashboard state summary."""
        tabs = []
        
        for tab in dashboard.get("tabs", []):
            # Get modules for this tab
            tab_modules = [
                m for m in dashboard.get("modules", [])
                if m.get("tab") == tab["id"]
            ]
            
            # Create compact modules
            compact_modules = []
            for module in tab_modules:
                compact_modules.append({
                    "id": module["id"],
                    "type": module["type"],
                    "size": module["size"],
                    "title": module.get("data", {}).get("title"),
                    "accent": module["accent"],
                    "value": module.get("data", {}).get("value")
                })
            
            tabs.append({
                "id": tab["id"],
                "label": tab["label"],
                "module_count": len(compact_modules),
                "modules": compact_modules
            })
        
        return {
            "subject": dashboard.get("meta", {}).get("subject", ""),
            "mode": dashboard.get("meta", {}).get("mode", ""),
            "tabs": tabs
        }
