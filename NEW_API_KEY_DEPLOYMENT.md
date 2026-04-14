# New API Key Deployment Guide

## Changes Made

### 1. Added "Nova" API Key Option
- **Name:** Nova
- **Color:** Pink (#EC4899)
- **Key:** `AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk`

### 2. Updated Files

#### Frontend
- `kore-frontend/src/components/layout/SettingsDropdown.tsx`
  - Added Nova to API_KEYS array
  - Uses `NEXT_PUBLIC_GEMINI_KEY_6` environment variable

- `kore-frontend/.env.local`
  - Added `NEXT_PUBLIC_GEMINI_KEY_6` with the new key

#### Backend
- `fastapi-backend/.env`
  - Updated default `GEMINI_API_KEY` to the new working key
  - Increased timeouts to 5 minutes (300 seconds)

---

## Local Testing

### Frontend
The frontend will automatically reload and show the new "Nova" option in the settings dropdown.

### Backend
The backend is already using the new API key as the default.

---

## Hosted Version Deployment

### For Vercel/Netlify (Frontend)

Add this environment variable:
```
NEXT_PUBLIC_GEMINI_KEY_6=AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk
```

### For Render/Railway (Backend)

Update this environment variable:
```
GEMINI_API_KEY=AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk
```

---

## How to Use

1. **Local:** Select "Nova" from the settings dropdown (AI icon in top bar)
2. **Hosted:** 
   - Add the environment variable to your hosting platform
   - Redeploy or restart the service
   - Select "Nova" from the dropdown

---

## API Key Status

| Name    | Status | Notes |
|---------|--------|-------|
| Default | ❌ Quota exceeded | Old keys hit 20 req/day limit |
| Leo     | ❌ Quota exceeded | Old keys hit 20 req/day limit |
| Max     | ❌ Quota exceeded | Old keys hit 20 req/day limit |
| Sam     | ❌ Quota exceeded | Old keys hit 20 req/day limit |
| Alex    | ❌ Quota exceeded | Old keys hit 20 req/day limit |
| Jordan  | ❌ Quota exceeded | Old keys hit 20 req/day limit |
| **Nova** | ✅ **Working** | **New unused key** |

---

## Timeout Configuration

Updated timeouts to handle large prompts:
- **Gemini Client:** 300 seconds (5 minutes)
- **API Endpoint:** 300 seconds (5 minutes)
- **Actual Generation Time:** ~60 seconds

This provides plenty of buffer for complex dashboard generation.

---

## Testing Checklist

- [x] API key validated with minimal test
- [x] Full dashboard generation tested (59.8 seconds)
- [x] Frontend dropdown updated
- [x] Backend using new key
- [x] Timeouts increased
- [ ] Hosted frontend deployed with new env var
- [ ] Hosted backend deployed with new env var
- [ ] End-to-end test on hosted version

---

## Next Steps

1. Deploy to hosted environment
2. Test Nova key selection
3. Verify dashboard generation works
4. Monitor API usage to avoid hitting quota
5. Consider upgrading to paid tier for higher limits
