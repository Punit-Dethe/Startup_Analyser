"""OpenRouter API client with retry logic and error handling."""

import json
import re
import asyncio
import logging
from typing import Any
import httpx

from app.utils.errors import GeminiAPIError, GeminiRateLimitError, GeminiParseError
from app.utils.logging import log_with_context

logger = logging.getLogger("kore")


class OpenRouterClient:
    """Wrapper for OpenRouter API with retry logic and error handling."""
    
    OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
    
    def __init__(self, api_key: str, model: str = "nvidia/nemotron-3-super-120b-a12b:free"):
        """
        Initialize OpenRouter client with API key and model selection.
        
        Args:
            api_key: OpenRouter API key
            model: Model name (default: nvidia/nemotron-3-super-120b-a12b:free)
        """
        self.api_key = api_key
        self.model_name = model
    
    def reconfigure(self, api_key: str) -> None:
        """
        Reconfigure client with a different API key.
        
        Args:
            api_key: New OpenRouter API key
        """
        self.api_key = api_key
        logger.info(f"OpenRouter client reconfigured with new API key: {api_key[:20]}...")
    
    def reconfigure_model(self, model: str) -> None:
        """
        Reconfigure client with a different model.
        
        Args:
            model: New model name
        """
        self.model_name = model
        logger.info(f"OpenRouter client reconfigured with model: {model}")
    
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
        Generate response from OpenRouter API.
        
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
                "openrouter_api_call_start",
                model=self.model_name,
                prompt_length=len(prompt),
                json_mode=json_mode
            )
            
            # Prepare request
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://kore-dashboard.app",  # Optional
                "X-Title": "KORE Dashboard"  # Optional
            }
            
            payload = {
                "model": self.model_name,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
            }
            
            # Enable JSON mode if requested
            if json_mode:
                payload["response_format"] = {"type": "json_object"}
            
            # Make API call with timeout
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.post(
                    self.OPENROUTER_API_URL,
                    headers=headers,
                    json=payload
                )
                
                # Check for errors
                if response.status_code != 200:
                    error_text = response.text
                    if response.status_code == 429:
                        logger.warning(f"OpenRouter rate limit exceeded: {error_text}")
                        raise GeminiRateLimitError("Rate limit exceeded", retry_after=60)
                    elif response.status_code == 401 or response.status_code == 403:
                        logger.error(f"OpenRouter authentication error: {error_text}")
                        raise GeminiAPIError(f"Authentication failed: {error_text}")
                    else:
                        logger.error(f"OpenRouter API error {response.status_code}: {error_text}")
                        raise GeminiAPIError(f"API request failed: {error_text}")
                
                # Parse response
                result = response.json()
                
                # Check for error in response body (even with 200 status)
                if "error" in result:
                    error_msg = result["error"].get("message", str(result["error"]))
                    raise GeminiAPIError(f"API returned error: {error_msg}")
                
                # Extract content
                if "choices" in result and len(result["choices"]) > 0:
                    response_text = result["choices"][0]["message"]["content"]
                else:
                    raise GeminiAPIError("No response content in API result")
            
            # Log successful call
            log_with_context(
                logger,
                "info",
                "openrouter_api_call_success",
                model=self.model_name,
                response_length=len(response_text),
                tokens_used=result.get("usage", {}).get("total_tokens")
            )
            
            # Parse JSON
            return self._extract_json(response_text)
            
        except asyncio.TimeoutError:
            logger.error("OpenRouter API request timed out")
            raise GeminiAPIError(f"Request timed out after {timeout} seconds")
        
        except httpx.RequestError as e:
            logger.error(f"OpenRouter connection error: {e}")
            raise GeminiAPIError(f"Connection failed: {str(e)}")
        
        except Exception as e:
            error_msg = str(e)
            # Re-raise our custom errors
            if isinstance(e, (GeminiAPIError, GeminiRateLimitError, GeminiParseError)):
                raise
            logger.error(f"OpenRouter API unexpected error: {error_msg}")
            raise GeminiAPIError(f"Unexpected error: {error_msg}")
    
    def _extract_json(self, response_text: str) -> dict[str, Any]:
        """
        Extract JSON from OpenRouter response.
        
        Args:
            response_text: Raw response text from OpenRouter
            
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
        logger.error(f"Failed to parse JSON from OpenRouter response: {response_text[:500]}")
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
