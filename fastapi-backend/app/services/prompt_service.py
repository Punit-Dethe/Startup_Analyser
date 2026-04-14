"""System prompt management service."""

import logging
from pathlib import Path
from typing import Dict

from app.utils.errors import PromptNotFoundError

logger = logging.getLogger("kore")


class PromptService:
    """Service for system prompt management."""
    
    def __init__(self, prompts_dir: Path | str = "prompts"):
        """
        Initialize with prompts directory path.
        
        Args:
            prompts_dir: Path to directory containing prompt markdown files
        """
        self.prompts_dir = Path(prompts_dir)
    
    def load_prompt(self, name: str) -> str:
        """
        Load system prompt from markdown file.
        
        Args:
            name: Prompt name (e.g., "generate", "chat")
            
        Returns:
            Prompt content as string
            
        Raises:
            PromptNotFoundError: Prompt file doesn't exist
        """
        # Load from file (no caching - always read fresh)
        prompt_path = self.prompts_dir / f"{name}.md"
        
        if not prompt_path.exists():
            logger.error(f"Prompt file not found: {prompt_path}")
            raise PromptNotFoundError(
                f"Prompt file '{name}.md' not found in {self.prompts_dir}"
            )
        
        try:
            with open(prompt_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            logger.debug(f"Loaded prompt '{name}' from {prompt_path}")
            return content
            
        except Exception as e:
            logger.error(f"Failed to read prompt file {prompt_path}: {e}")
            raise PromptNotFoundError(f"Failed to read prompt file: {e}")
    
    def get_prompt(self, file_path: str) -> str:
        """
        Load a prompt from a specific file path.
        
        Args:
            file_path: Path to prompt file (e.g., "prompts/generate.md" or "prompts/startupanalysis.md")
            
        Returns:
            Prompt content as string
            
        Raises:
            PromptNotFoundError: Prompt file doesn't exist
        """
        prompt_path = Path(file_path)
        
        if not prompt_path.exists():
            logger.error(f"Prompt file not found: {prompt_path}")
            raise PromptNotFoundError(
                f"Prompt file '{file_path}' not found"
            )
        
        try:
            with open(prompt_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            logger.debug(f"Loaded prompt from {prompt_path}")
            return content
            
        except Exception as e:
            logger.error(f"Failed to read prompt file {prompt_path}: {e}")
            raise PromptNotFoundError(f"Failed to read prompt file: {e}")
    
    def get_generate_prompt(self) -> str:
        """Load the generation system prompt."""
        return self.load_prompt("generate")
    
    def get_chat_prompt(self) -> str:
        """Load the chat system prompt."""
        return self.load_prompt("chat")
