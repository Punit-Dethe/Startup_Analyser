# Quick Setup: API Key Switching

## Step 1: Add Your API Keys

Edit `kore-frontend/.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_GEMINI_KEY_1=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_GEMINI_KEY_2=AIzaSyYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
NEXT_PUBLIC_GEMINI_KEY_3=AIzaSyZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
NEXT_PUBLIC_GEMINI_KEY_4=AIzaSyAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
NEXT_PUBLIC_GEMINI_KEY_5=AIzaSyBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
```

## Step 2: Restart Frontend

```bash
cd kore-frontend
npm run dev
```

## Step 3: Use the Feature

1. Click your profile picture (top-right)
2. Click "Settings"
3. Hover over "API Key"
4. Select one of: Leo, Max, Sam, Alex, or Jordan
5. Done! All API calls now use that key

## Step 4: Deploy to Production (Optional)

Add these environment variables in Vercel:
- `NEXT_PUBLIC_GEMINI_KEY_1`
- `NEXT_PUBLIC_GEMINI_KEY_2`
- `NEXT_PUBLIC_GEMINI_KEY_3`
- `NEXT_PUBLIC_GEMINI_KEY_4`
- `NEXT_PUBLIC_GEMINI_KEY_5`

No backend changes needed!

## How to Get Gemini API Keys

1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Select a Google Cloud project
4. Copy the generated key
5. Repeat 5 times for 5 different keys

## Testing

Open browser DevTools → Network tab → Make a request → Check headers for `X-Gemini-API-Key`
