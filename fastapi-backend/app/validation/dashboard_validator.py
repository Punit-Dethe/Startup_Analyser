"""Dashboard structure validation."""

import logging
from typing import Any

from app.utils.errors import ValidationError

logger = logging.getLogger("kore")


class DashboardValidator:
    """Validator for dashboard structure."""
    
    def validate(self, dashboard: dict[str, Any]) -> None:
        """
        Validate dashboard structure.
        
        Args:
            dashboard: Dashboard payload to validate
            
        Raises:
            ValidationError: Validation failed
        """
        errors = []
        
        # Validate required top-level fields
        required_fields = ["meta", "tabs", "chat_intro", "modules"]
        for field in required_fields:
            if field not in dashboard:
                errors.append(f"Missing required field: {field}")
        
        if errors:
            raise ValidationError(f"Dashboard validation failed: {', '.join(errors)}")
        
        # Validate meta
        self._validate_meta(dashboard.get("meta", {}), errors)
        
        # Validate tabs
        tabs = dashboard.get("tabs", [])
        tab_ids = self._validate_tabs(tabs, errors)
        
        # Validate modules
        self._validate_modules(dashboard.get("modules", []), tab_ids, errors)
        
        if errors:
            logger.error(f"Dashboard validation failed: {errors}")
            raise ValidationError(f"Dashboard validation failed: {', '.join(errors)}")
        
        logger.info("Dashboard validation passed")
    
    def _validate_meta(self, meta: dict[str, Any], errors: list[str]) -> None:
        """Validate meta section."""
        required_meta_fields = ["subject", "mode", "brand_color", "logo_initials", "page_title", "page_subtitle"]
        for field in required_meta_fields:
            if field not in meta:
                errors.append(f"Missing meta field: {field}")
    
    def _validate_tabs(self, tabs: list[dict[str, Any]], errors: list[str]) -> set[str]:
        """Validate tabs and return set of tab IDs."""
        tab_ids = set()
        
        if not tabs:
            errors.append("Dashboard must have at least one tab")
            return tab_ids
        
        for i, tab in enumerate(tabs):
            if "id" not in tab:
                errors.append(f"Tab {i} missing id field")
            else:
                tab_ids.add(tab["id"])
            
            if "label" not in tab:
                errors.append(f"Tab {i} missing label field")
        
        return tab_ids
    
    def _validate_modules(self, modules: list[dict[str, Any]], tab_ids: set[str], errors: list[str]) -> None:
        """Validate modules."""
        if not modules:
            errors.append("Dashboard must have at least one module")
            return
        
        module_ids = set()
        
        for i, module in enumerate(modules):
            # Check required fields
            required_module_fields = ["id", "type", "size", "accent", "data"]
            for field in required_module_fields:
                if field not in module:
                    errors.append(f"Module {i} missing required field: {field}")
            
            # Check unique ID
            module_id = module.get("id")
            if module_id:
                if module_id in module_ids:
                    errors.append(f"Duplicate module ID: {module_id}")
                module_ids.add(module_id)
            
            # Check tab reference
            tab = module.get("tab")
            if tab and tab not in tab_ids:
                errors.append(f"Module {i} references non-existent tab: {tab}")
