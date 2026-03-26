"""Gemini API client with retry logic and error handling."""

import json
import re
import asyncio
import logging
from typing import Any
import google.generativeai as genai
from google.generativeai.types import GenerationConfig

from app.utils.errors import GeminiAPIError, GeminiRateLimitError, GeminiParseError
from app.utils.logging import log_with_context

logger = logging.getLogger("kore")


class GeminiClient:
    """Wrapper for Google Gemini API with retry logic and error handling."""
    
    def __init__(self, api_key: str, model: str = "gemini-2.5-flash"):
        """
        Initialize Gemini client with API key and model selection.
        
        Args:
            api_key: Google Gemini API key
            model: Model name (default: gemini-2.5-flash - stable and reliable)
        """
        self.api_key = api_key
        self.model_name = model
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model)
    
    def reconfigure(self, api_key: str) -> None:
        """
        Reconfigure client with a different API key.
        
        Args:
            api_key: New Google Gemini API key
        """
        self.api_key = api_key
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(self.model_name)
        logger.info(f"Gemini client reconfigured with new API key: {api_key[:20]}...")
    
    async def generate(
        self,
        prompt: str,
        system_prompt: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 8192,
        json_mode: bool = True,
        timeout: float = 150.0  # 2.5 minutes for complex queries
    ) -> dict[str, Any]:
        """
        Generate response from Gemini API.
        
        Args:   
            prompt: User prompt
            system_prompt: System instructions
            temperature: Sampling temperature (0.0-1.0)
            max_tokens: Maximum response tokens
            json_mode: Enable JSON response mode
            timeout: Request timeout in seconds
            
        Returns:
            Parsed JSON response
            
        Raises:
            GeminiAPIError: API request failed
            GeminiRateLimitError: Rate limit exceeded
            GeminiParseError: Failed to parse JSON response
        """
        try:
            # Configure generation
            generation_config = GenerationConfig(
                temperature=temperature,
                top_p=0.95,
                top_k=40,
                max_output_tokens=max_tokens,
                candidate_count=1,  # Only one candidate
            )
            
            if json_mode:
                generation_config.response_mime_type = "application/json"
            
            # Build full prompt
            full_prompt = prompt
            if system_prompt:
                full_prompt = f"{system_prompt}\n\n{prompt}"
            
            # Log API call
            log_with_context(
                logger,
                "info",
                "gemini_api_call_start",
                model=self.model_name,
                prompt_length=len(full_prompt),
                json_mode=json_mode
            )
            
            # Make API call with timeout
            response = await asyncio.wait_for(
                asyncio.to_thread(
                    self.model.generate_content,
                    full_prompt,
                    generation_config=generation_config
                ),
                timeout=timeout
            )
            
            # Extract text from response
            if hasattr(response, 'parts') and response.parts:
                # Handle multi-part responses
                response_text = ''.join([part.text for part in response.parts if hasattr(part, 'text')])
            else:
                response_text = response.text
            
            # Log successful call
            log_with_context(
                logger,
                "info",
                "gemini_api_call_success",
                model=self.model_name,
                response_length=len(response_text)
            )
            
            # Parse JSON
            return self._extract_json(response_text)
            
        except asyncio.TimeoutError:
            logger.error("Gemini API request timed out")
            raise GeminiAPIError(f"Request timed out after {timeout} seconds")
        
        except Exception as e:
            error_msg = str(e)
            
            # Check for rate limit
            if "429" in error_msg or "rate limit" in error_msg.lower():
                logger.warning(f"Gemini API rate limit exceeded: {error_msg}")
                raise GeminiRateLimitError("Rate limit exceeded", retry_after=60)
            
            # Check for auth errors
            if "401" in error_msg or "403" in error_msg or "api key" in error_msg.lower():
                logger.error(f"Gemini API authentication error: {error_msg}")
                raise GeminiAPIError(f"Authentication failed: {error_msg}")
            
            # Generic error
            logger.error(f"Gemini API error: {error_msg}")
            raise GeminiAPIError(f"API request failed: {error_msg}")
    
    def _extract_json(self, response_text: str) -> dict[str, Any]:
        """
        Extract JSON from Gemini response.
        
        Args:
            response_text: Raw response text from Gemini
            
        Returns:
            Parsed JSON object
            
        Raises:
            GeminiParseError: Failed to parse JSON
        """
        # Try direct parse
        try:
            return json.loads(response_text)
        except json.JSONDecodeError:
            pass
        
        # Try markdown code block extraction
        json_match = re.search(r'```json\s*(\{.*?\})\s*```', response_text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except json.JSONDecodeError:
                pass
        
        # Try finding JSON object
        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(0))
            except json.JSONDecodeError:
                pass
        
        # All parsing attempts failed
        logger.error(f"Failed to parse JSON from Gemini response: {response_text[:500]}")
        raise GeminiParseError("No valid JSON found in response")
    
    async def generate_with_retry(
        self,
        prompt: str,
        max_retries: int = 3,
        **kwargs
    ) -> dict[str, Any]:
        """
        Generate with exponential backoff retry logic.
        
        Args:
            prompt: User prompt
            max_retries: Maximum number of retry attempts
            **kwargs: Additional arguments for generate()
            
        Returns:
            Parsed JSON response
            
        Raises:
            GeminiAPIError: All retry attempts failed
            GeminiRateLimitError: Rate limit exceeded
        """
        for attempt in range(max_retries):
            try:
                return await self.generate(prompt, **kwargs)
            
            except GeminiRateLimitError as e:
                if attempt == max_retries - 1:
                    raise
                wait_time = e.retry_after or (2 ** attempt)
                logger.warning(f"Rate limit hit, retrying in {wait_time}s (attempt {attempt + 1}/{max_retries})")
                await asyncio.sleep(wait_time)
            
            except GeminiAPIError as e:
                if attempt == max_retries - 1:
                    raise
                wait_time = 2 ** attempt
                logger.warning(f"API error, retrying in {wait_time}s (attempt {attempt + 1}/{max_retries})")
                await asyncio.sleep(wait_time)
        
        raise GeminiAPIError("All retry attempts failed")
