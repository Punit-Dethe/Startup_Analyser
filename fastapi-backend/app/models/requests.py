"""Request models for API endpoints."""

from pydantic import BaseModel, Field
from typing import Literal


class GenerateRequest(BaseModel):
    """Request model for /api/generate endpoint."""
    
    query: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="User's natural language query for dashboard generation"
    )


class ChatMessage(BaseModel):
    """Single message in chat history."""
    
    role: Literal["user", "assistant"]
    content: str


class CompactModule(BaseModel):
    """Compact module summary for chat context."""
    
    id: str
    type: str
    size: str
    title: str | None
    accent: str
    value: str | int | None


class DashboardContext(BaseModel):
    """Dashboard context for chat requests."""
    
    subject: str
    active_tab: str
    visible_modules: list[CompactModule]


class ChatRequest(BaseModel):
    """Request model for /api/chat endpoint."""
    
    message: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="User's chat message"
    )
    history: list[ChatMessage] = Field(
        default_factory=list,
        description="Conversation history"
    )
    context: DashboardContext = Field(
        ...,
        description="Current dashboard context"
    )
