"""Response models for API endpoints."""

from pydantic import BaseModel
from typing import Any, Literal


class DashboardMeta(BaseModel):
    """Dashboard metadata."""
    
    subject: str
    mode: Literal["company", "startup", "market"]
    brand_color: str
    colors: dict[str, str] | None = None
    logo_initials: str
    page_title: str
    page_subtitle: str


class Tab(BaseModel):
    """Dashboard tab."""
    
    id: str
    label: str
    isTemporary: bool = False


class Module(BaseModel):
    """Dashboard module."""
    
    id: str
    tab: str | None = None
    type: str
    size: str
    accent: str
    data: dict[str, Any]


class DashboardPayload(BaseModel):
    """Complete dashboard structure."""
    
    meta: DashboardMeta
    tabs: list[Tab]
    chat_intro: str
    modules: list[Module]


class CompactModule(BaseModel):
    """Compact module summary."""
    
    id: str
    type: str
    size: str
    title: str | None
    accent: str
    value: str | int | None


class CompactTab(BaseModel):
    """Compact tab summary."""
    
    id: str
    label: str
    module_count: int
    modules: list[CompactModule]


class CompactState(BaseModel):
    """Compact dashboard state."""
    
    subject: str
    mode: str
    tabs: list[CompactTab]


class GenerateResponse(BaseModel):
    """Response model for /api/generate endpoint."""
    
    dashboard: DashboardPayload
    dashboard_state: CompactState
    generated_at: str


class ChatResponse(BaseModel):
    """Response model for /api/chat endpoint."""
    
    action: Literal["CHAT", "NEW_DASHBOARD", "TEMPORARY_TAB"]
    message: str | None = None
    new_prompt: str | None = None
    tab: Tab | None = None
    modules: list[Module] | None = None


class ErrorResponse(BaseModel):
    """Error response model."""
    
    error: str
    request_id: str
    details: dict[str, Any] | None = None


class HealthResponse(BaseModel):
    """Health check response model."""
    
    status: Literal["healthy", "unhealthy"]
    timestamp: str
    version: str
    gemini_configured: bool
