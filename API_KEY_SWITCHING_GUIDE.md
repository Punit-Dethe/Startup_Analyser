# API Key Switching Guide

This guide explains how to configure and use the multiple Gemini API key switching feature for testing and avoiding rate limits.

## Overview

The system supports switching between 5 different Gemini API keys through the UI. This is useful for:
- Avoiding rate limits during heavy testing
- Distributing API usage across multiple keys
- Testing with different API key configurations

## Configuration

### Frontend Setup

1. Open `kore-frontend/.env.local`
2. Add your 5 Gemini API keys:

```env
NEXT_PUBLIC_GEMINI_KEY_1=your_first_api_key_here
NEXT_PUBLIC_GEMINI_KEY_2=your_second_api_key_here
NEXT_PUBLIC_GEMINI_KEY_3=your_third_api_key_here
NEXT_PUBLIC_GEMINI_KEY_4=your_fourth_api_key_here
NEXT_PUBLIC_GEMINI_KEY_5=your_fifth_api_key_here
```

3. Restart the frontend development server

### Backend Setup

No backend configuration needed! The backend automatically accepts custom API keys via the `X-Gemini-API-Key` header.

## How It Works

### Frontend Flow

1. User selects an API key from the Settings menu in the profile dropdown
2. Selected key is stored in `localStorage` as `currentGeminiApiKey`
3. When making API calls, the frontend reads the selected key from localStorage
4. The key is sent to the backend via the `X-Gemini-API-Key` header

### Backend Flow

1. API endpoints (`/api/generate` and `/api/chat`) extract the `X-Gemini-API-Key` header
2. If a custom key is provided, the `GeminiClient` is reconfigured with that key
3. If no custom key is provided, the default `GEMINI_API_KEY` from environment is used
4. The API call proceeds with the selected key

## Usage

### Switching API Keys

1. Click on your profile picture in the top-right corner
2. Click on "Settings" to expand the settings menu
3. Hover over "API Key" to see the submenu
4. Click on one of the 5 keys (Leo, Max, Sam, Alex, Jordan)
5. A checkmark appears next to the selected key
6. All subsequent API calls will use the selected key

### Key Names

The 5 API keys have friendly names for easy identification:
- Key 1: Leo
- Key 2: Max
- Key 3: Sam
- Key 4: Alex
- Key 5: Jordan

### Default Behavior

- On first load, no key is selected (uses backend default)
- Once a key is selected, it persists across page refreshes
- The selected key is stored in browser localStorage

## Testing

### Local Testing

1. Configure all 5 keys in `.env.local`
2. Start both frontend and backend servers
3. Switch between keys in the UI
4. Monitor network requests to verify the `X-Gemini-API-Key` header is being sent

### Production Testing

1. Add all 5 keys as environment variables in Vercel:
   - `NEXT_PUBLIC_GEMINI_KEY_1`
   - `NEXT_PUBLIC_GEMINI_KEY_2`
   - `NEXT_PUBLIC_GEMINI_KEY_3`
   - `NEXT_PUBLIC_GEMINI_KEY_4`
   - `NEXT_PUBLIC_GEMINI_KEY_5`

2. Redeploy the frontend

3. Backend requires no changes (it accepts any key via header)

## Troubleshooting

### Key Not Working

- Verify the key is correctly set in `.env.local`
- Check browser console for errors
- Verify the key is being sent in the request headers (Network tab)
- Ensure the key has proper permissions in Google Cloud Console

### Rate Limits Still Hit

- Verify you're actually switching keys (check localStorage in DevTools)
- Ensure each key has its own quota in Google Cloud Console
- Consider adding delays between requests

### Key Not Persisting

- Check if localStorage is enabled in your browser
- Clear browser cache and try again
- Verify the key selection UI is working (checkmark appears)

## Implementation Details

### Files Modified

**Frontend:**
- `kore-frontend/src/components/layout/Topbar.tsx` - UI for key selection
- `kore-frontend/src/lib/api.ts` - Reads key from localStorage and sends in requests
- `kore-frontend/src/app/api/generate/route.ts` - Forwards key to backend
- `kore-frontend/src/app/api/chat/route.ts` - Forwards key to backend
- `kore-frontend/.env.local` - Stores the 5 API keys

**Backend:**
- `fastapi-backend/app/integrations/gemini_client.py` - Added `reconfigure()` method
- `fastapi-backend/app/api/generate.py` - Extracts key from header
- `fastapi-backend/app/api/chat.py` - Extracts key from header
- `fastapi-backend/app/services/generate_service.py` - Passes key to client
- `fastapi-backend/app/services/chat_service.py` - Passes key to client

### API Contract

**Request Header:**
```
X-Gemini-API-Key: your_custom_api_key_here
```

**Fallback Behavior:**
If no custom key is provided, the backend uses the default `GEMINI_API_KEY` from its environment variables.

## Security Notes

- API keys are stored in environment variables (not committed to git)
- Keys are sent via HTTPS in production (secure)
- Keys are stored in localStorage (client-side only)
- Backend validates keys through Google's API (invalid keys will fail)

## Future Enhancements

Possible improvements:
- Add key usage tracking (calls per key)
- Automatic key rotation on rate limit
- Key health monitoring
- Admin panel for key management
