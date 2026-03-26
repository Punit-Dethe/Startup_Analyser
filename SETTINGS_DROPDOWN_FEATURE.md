# Settings Dropdown Feature

## Overview

Unified settings dropdown that allows users to configure:
1. **API Key** - Select which Gemini API key to use
2. **Model** - Choose between 4 Gemini models
3. **Temperature** - Adjust creativity/precision (0.4 to 0.8)

## Features

### Model Options
1. **gemini-2.0-flash-exp** - Fast & Efficient (Fastest responses)
2. **gemini-2.5-flash** - Balanced & Stable ⭐ (Recommended, default)
3. **gemini-exp-1206** - Most Advanced (Latest features)
4. **gemini-1.5-pro** - High Quality (Best quality)

### Temperature Options
- **0.4 - Precise** - Strict & focused
- **0.5 - Focused** - Consistent output
- **0.6 - Balanced** - Good middle ground
- **0.7 - Standard** ⭐ (Recommended, default)
- **0.8 - Creative** - More variation

### API Keys
- Default (Backend) - Uses server's default key
- Leo (Orange)
- Max (Yellow)
- Sam (Blue)
- Alex (Green)
- Jordan (Purple)

## UI Design

Single dropdown button that opens a menu with three sections:
- API Key section (with colored dots)
- Model section (with descriptions and ⭐ for default)
- Temperature section (with values and descriptions)

Each section has:
- Section header
- List of options
- Visual feedback (checkmark for selected)
- Hover effects
- Default indicators (⭐)

## Implementation

### Backend Changes

**Files Modified:**
- `fastapi-backend/app/api/generate.py` - Accept model and temperature headers
- `fastapi-backend/app/api/chat.py` - Accept model and temperature headers
- `fastapi-backend/app/services/generate_service.py` - Use custom model/temperature
- `fastapi-backend/app/services/chat_service.py` - Use custom model/temperature
- `fastapi-backend/app/integrations/gemini_client.py` - Add `reconfigure_model()` method

**New Headers:**
- `X-Gemini-Model` - Optional model selection
- `X-Gemini-Temperature` - Optional temperature (as string, parsed to float)

**Defaults:**
- Model: `gemini-2.5-flash`
- Temperature: `0.7`

### Frontend Changes

**Files Modified:**
- `kore-frontend/src/lib/api.ts` - Send model and temperature headers
- `kore-frontend/src/app/page.tsx` - Use new SettingsDropdown component

**Files Created:**
- `kore-frontend/src/components/layout/SettingsDropdown.tsx` - New unified dropdown

**LocalStorage Keys:**
- `currentGeminiApiKey` - Selected API key
- `selectedGeminiModel` - Selected model
- `selectedTemperature` - Selected temperature

## Usage

1. **Click the settings button** (shows current API key name with colored icon)
2. **Select API Key** - Choose which key to use
3. **Select Model** - Choose which Gemini model
4. **Select Temperature** - Adjust creativity level
5. **Settings persist** across page reloads (localStorage)
6. **Settings apply** to both dashboard generation and chat

## Testing

1. Open the application
2. Click the settings dropdown (left side of search bar)
3. Try changing:
   - API key (should see color change on button)
   - Model (check console logs)
   - Temperature (check console logs)
4. Generate a dashboard - should use selected settings
5. Use chat - should use selected settings
6. Refresh page - settings should persist

## Console Logging

The application logs all setting changes:
```
[KORE] API Key switched to: Leo
[KORE] Model switched to: gemini-exp-1206
[KORE] Temperature switched to: 0.8
[KORE] Using custom API key: AIzaSy...
[KORE] Using model: gemini-exp-1206
[KORE] Using temperature: 0.8
```

## Benefits

1. **User Control** - Fine-tune AI behavior
2. **Experimentation** - Try different models/temperatures
3. **API Key Management** - Easy switching between keys
4. **Clean UI** - Single dropdown instead of multiple controls
5. **Persistent** - Settings saved across sessions
6. **Minimal Backend Changes** - Just header parsing

## Future Enhancements

- Add more models as they become available
- Add preset combinations (e.g., "Fast Mode", "Quality Mode")
- Add tooltips explaining each option
- Add model performance metrics
- Add cost estimates per model
- Add usage tracking per API key
