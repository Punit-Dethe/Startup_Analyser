"""Groq API client with retry logic and error handling."""

import json
import re
import asyncio
import logging
from typing import Any
from groq import Groq, AsyncGroq
from groq import RateLimitError, APIError, APIConnectionError, AuthenticationError

from app.utils.errors import GeminiAPIError, GeminiRateLimitError, GeminiParseError
from app.utils.logging import log_with_context

logger = logging.getLogger("kore")


class GroqClient:
    """Wrapper for Groq API with retry logic and error handling."""
    
    def __init__(self, api_key: str, model: str = "llama-3.1-8b-instant"):
        """
        Initialize Groq client with API key and model selection.
        
        Args:
            api_key: Groq API key
            model: Model name (default: llama-3.1-8b-instant - Fast with high token limits)
        """
        self.api_key = api_key
        self.model_name = model
        self.client = AsyncGroq(api_key=api_key)
        self.sync_client = Groq(api_key=api_key)
    
    def reconfigure(self, api_key: str) -> None:
        """
        Reconfigure client with a different API key.
        
        Args:
            api_key: New Groq API key
        """
        self.api_key = api_key
        self.client = AsyncGroq(api_key=api_key)
        self.sync_client = Groq(api_key=api_key)
        logger.info(f"Groq client reconfigured with new API key: {api_key[:20]}...")
    
    def reconfigure_model(self, model: str) -> None:
        """
        Reconfigure client with a different model.
        
        Args:
            model: New model name
        """
        self.model_name = model
        logger.info(f"Groq client reconfigured with model: {model}")
    
    async def generate(
        self,
        prompt: str,
        system_prompt: str | None = None,
        temperature: float = 0.7,
        max_tokens: int = 8192,
        json_mode: bool = True,
        timeout: float = 300.0  # 5 minutes for complex queries
    ) -> dict[str, Any]:
        """
        Generate response from Groq API.
        
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
            GeminiAPIError: API request failed (reusing Gemini errors for compatibility)
            GeminiRateLimitError: Rate limit exceeded
            GeminiParseError: Failed to parse JSON response
        """
        try:
            # Build messages
            messages = []
            
            if system_prompt:
                messages.append({
                    "role": "system",
                    "content": system_prompt
                })
            
            messages.append({
                "role": "user",
                "content": prompt
            })
            
            # Log API call
            log_with_context(
                logger,
                "info",
                "groq_api_call_start",
                model=self.model_name,
                prompt_length=len(prompt),
                json_mode=json_mode
            )
            
            # Prepare request parameters
            request_params = {
                "model": self.model_name,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            }
            
            # Enable JSON mode if requested
            if json_mode:
                request_params["response_format"] = {"type": "json_object"}
            
            # Make API call with timeout
            response = await asyncio.wait_for(
                self.client.chat.completions.create(**request_params),
                timeout=timeout
            )
            
            # Extract text from response
            response_text = response.choices[0].message.content
            
            # Log successful call
            log_with_context(
                logger,
                "info",
                "groq_api_call_success",
                model=self.model_name,
                response_length=len(response_text),
                tokens_used=response.usage.total_tokens if hasattr(response, 'usage') else None
            )
            
            # Parse JSON
            return self._extract_json(response_text)
            
        except asyncio.TimeoutError:
            logger.error("Groq API request timed out")
            raise GeminiAPIError(f"Request timed out after {timeout} seconds")
        
        except RateLimitError as e:
            logger.warning(f"Groq API rate limit exceeded: {e}")
            raise GeminiRateLimitError("Rate limit exceeded", retry_after=60)
        
        except AuthenticationError as e:
            logger.error(f"Groq API authentication error: {e}")
            raise GeminiAPIError(f"Authentication failed: {str(e)}")
        
        except APIConnectionError as e:
            logger.error(f"Groq API connection error: {e}")
            raise GeminiAPIError(f"Connection failed: {str(e)}")
        
        except APIError as e:
            logger.error(f"Groq API error: {e}")
            raise GeminiAPIError(f"API request failed: {str(e)}")
        
        except Exception as e:
            error_msg = str(e)
            logger.error(f"Groq API unexpected error: {error_msg}")
            raise GeminiAPIError(f"Unexpected error: {error_msg}")
    
    def _extract_json(self, response_text: str) -> dict[str, Any]:
        """
        Extract JSON from Groq response.
        
        Args:
            response_text: Raw response text from Groq
            
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
        logger.error(f"Failed to parse JSON from Groq response: {response_text[:500]}")
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
