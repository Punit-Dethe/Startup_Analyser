# Nova API Key - Hosted Deployment Instructions

## Summary
Nova is the 6th API key option, following the exact same pattern as Leo, Max, Sam, Alex, and Jordan.

---

## Local Setup ✅ (Already Complete)

### Frontend
**File:** `kore-frontend/.env.local`
```env
NEXT_PUBLIC_GEMINI_KEY_6=AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk
```

**File:** `kore-frontend/src/components/layout/SettingsDropdown.tsx`
```typescript
const API_KEYS = [
  { id: null, label: 'Default', color: '#000000' },
  { id: process.env.NEXT_PUBLIC_GEMINI_KEY_1, label: 'Leo', color: '#FF6B35' },
  { id: process.env.NEXT_PUBLIC_GEMINI_KEY_2, label: 'Max', color: '#F7B801' },
  { id: process.env.NEXT_PUBLIC_GEMINI_KEY_3, label: 'Sam', color: '#0496FF' },
  { id: process.env.NEXT_PUBLIC_GEMINI_KEY_4, label: 'Alex', color: '#22C55E' },
  { id: process.env.NEXT_PUBLIC_GEMINI_KEY_5, label: 'Jordan', color: '#A855F7' },
  { id: process.env.NEXT_PUBLIC_GEMINI_KEY_6, label: 'Nova', color: '#EC4899' },  // ← NEW
]
```

---

## Hosted Deployment (Action Required)

### Step 1: Add Environment Variable to Frontend

Go to your frontend hosting platform (Vercel/Netlify/etc.) and add:

```
NEXT_PUBLIC_GEMINI_KEY_6=AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk
```

**Important:** The variable name MUST be exactly `NEXT_PUBLIC_GEMINI_KEY_6` (case-sensitive).

### Step 2: Redeploy Frontend

After adding the environment variable, trigger a redeploy of your frontend.

### Step 3: Verify

1. Open your hosted frontend
2. Click the AI icon (settings dropdown) in the top bar
3. Expand "API Key" section
4. You should see "Nova" with a pink dot
5. Select Nova
6. Generate a dashboard to test

---

## How It Works

### Pattern Overview

1. **Environment Variable:** `NEXT_PUBLIC_GEMINI_KEY_6` stores the actual API key
2. **SettingsDropdown:** Reads the env var and creates a menu option
3. **User Selection:** When Nova is selected, the key is stored in localStorage
4. **API Call:** Frontend sends the key via `X-Gemini-API-Key` header
5. **Backend:** Receives the header and uses that key instead of default

### Data Flow

```
User clicks "Nova"
  ↓
localStorage.setItem('currentGeminiApiKey', 'AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk')
  ↓
User generates dashboard
  ↓
Frontend reads localStorage
  ↓
Frontend sends: X-Gemini-API-Key: AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk
  ↓
Next.js API route forwards header to backend
  ↓
Backend uses Nova key instead of default
```

---

## Troubleshooting

### Issue: Nova appears but doesn't work

**Cause:** `NEXT_PUBLIC_GEMINI_KEY_6` is not set in hosted environment

**Solution:** 
1. Check environment variables in your hosting dashboard
2. Ensure `NEXT_PUBLIC_GEMINI_KEY_6` is set
3. Redeploy after adding the variable

### Issue: Nova doesn't appear at all

**Cause:** Frontend code not deployed

**Solution:**
1. Ensure `SettingsDropdown.tsx` has the Nova entry
2. Redeploy frontend

### Issue: Nova selected but uses default key

**Cause:** Environment variable is `null` or `undefined`

**Solution:**
1. Verify the exact variable name: `NEXT_PUBLIC_GEMINI_KEY_6`
2. Check for typos
3. Ensure the value is the full API key
4. Redeploy after fixing

---

## Verification Checklist

- [ ] `NEXT_PUBLIC_GEMINI_KEY_6` added to hosted frontend environment
- [ ] Frontend redeployed
- [ ] Nova appears in dropdown with pink color
- [ ] Selecting Nova stores key in localStorage
- [ ] Dashboard generation works with Nova selected
- [ ] Console shows: "Using custom API key: AIzaSyCxbNc7Idf3UStf..."

---

## Environment Variables Summary

### Frontend (Vercel/Netlify)
```
NEXT_PUBLIC_BACKEND_TYPE=fastapi
NEXT_PUBLIC_FASTAPI_BASE_URL=https://your-backend-url.com
NEXT_PUBLIC_GEMINI_KEY_1=AIzaSyDwN5Noz1W-z6wmVEWpbNEO53NR6lKHF5w
NEXT_PUBLIC_GEMINI_KEY_2=AIzaSyAw40Osfw1IQzHZYJnpNnwXcrVN5XmNTL0
NEXT_PUBLIC_GEMINI_KEY_3=AIzaSyCN-jBh4akNZqxZ-gF90buz5LbpxBm9qcI
NEXT_PUBLIC_GEMINI_KEY_4=AIzaSyC7TrCKOoyRROLgGDtoqfN4ydWDY57uCSk
NEXT_PUBLIC_GEMINI_KEY_5=AIzaSyCXQZYPrBTZJz1ECgTEfqoHy4Cq2WOVPf8
NEXT_PUBLIC_GEMINI_KEY_6=AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk  ← ADD THIS
```

### Backend (Render/Railway)
```
GEMINI_API_KEY=AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk
FRONTEND_URL=https://your-frontend-url.com
ENVIRONMENT=production
```

---

## Files Modified (Already Committed)

```
kore-frontend/
├── src/components/layout/SettingsDropdown.tsx  ✅ Nova added
├── .env.local                                   ✅ KEY_6 added
├── src/app/api/generate/route.ts               ✅ Headers forwarded
└── src/app/api/chat/route.ts                   ✅ Headers forwarded

fastapi-backend/
├── .env                                         ✅ Default key updated
├── app/integrations/gemini_client.py           ✅ Timeout increased
└── app/api/generate.py                         ✅ Timeout increased
```

---

## Next Steps

1. **Add `NEXT_PUBLIC_GEMINI_KEY_6` to your hosted frontend environment**
2. **Redeploy frontend**
3. **Test Nova selection**
4. **Proceed with multi-mode system development**

The code is ready - you just need to add the environment variable to your hosting platform!
