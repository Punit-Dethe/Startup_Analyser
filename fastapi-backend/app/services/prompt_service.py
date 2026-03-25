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
        self._cache: Dict[str, str] = {}
    
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
        # Check cache first
        if name in self._cache:
            logger.debug(f"Loading prompt '{name}' from cache")
            return self._cache[name]
        
        # Load from file
        prompt_path = self.prompts_dir / f"{name}.md"
        
        if not prompt_path.exists():
            logger.error(f"Prompt file not found: {prompt_path}")
            raise PromptNotFoundError(
                f"Prompt file '{name}.md' not found in {self.prompts_dir}"
            )
        
        try:
            with open(prompt_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Cache the prompt
            self._cache[name] = content
            
            logger.info(f"Loaded prompt '{name}' from {prompt_path}")
            return content
            
        except Exception as e:
            logger.error(f"Failed to read prompt file {prompt_path}: {e}")
            raise PromptNotFoundError(f"Failed to read prompt file: {e}")
    
    def reload_prompts(self) -> None:
        """Reload all prompts from disk (clears cache)."""
        self._cache.clear()
        logger.info("Prompt cache cleared")
    
    def get_generate_prompt(self) -> str:
        """Load the generation system prompt."""
        return self.load_prompt("generate")
    
    def get_chat_prompt(self) -> str:
        """Load the chat system prompt."""
        return self.load_prompt("chat")
