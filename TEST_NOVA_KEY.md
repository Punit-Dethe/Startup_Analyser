# Test Nova Key Locally

## Quick Test Steps

1. **Open the app:** http://localhost:3000

2. **Open browser console** (F12 or Cmd+Option+I)

3. **Click the AI icon** in the top bar (settings dropdown)

4. **Expand "API Key" section**

5. **You should see:**
   - Default (black dot)
   - Leo (orange dot)
   - Max (yellow dot)
   - Sam (blue dot)
   - Alex (green dot)
   - Jordan (purple dot)
   - **Nova (pink dot)** ← NEW

6. **Click Nova**

7. **Check console output:**
   ```
   [KORE] API Key switched to: Nova
   [KORE] API Key value: AIzaSyCxbNc7Idf3UStf...
   ```

8. **Generate a dashboard** (type any query and press Enter)

9. **Check console output:**
   ```
   [KORE] Using custom API key: AIzaSyCxbNc7Idf3UStf...
   ```

10. **Dashboard should generate successfully** (~60 seconds)

---

## Expected Behavior

✅ Nova appears in dropdown with pink color  
✅ Selecting Nova stores key in localStorage  
✅ Console shows Nova key being used  
✅ Dashboard generation works  
✅ No 500 errors  
✅ No rate limit errors  

---

## If Nova Doesn't Appear

1. Check `.env.local` has `NEXT_PUBLIC_GEMINI_KEY_6`
2. Restart frontend server:
   ```bash
   cd kore-frontend
   npm run dev
   ```

---

## If Nova Appears But Doesn't Work

1. Check console for the key value
2. If it shows `null`, the env var isn't loaded
3. Restart the frontend server

---

## For Hosted Version

The local setup is complete. For hosted:

1. Add `NEXT_PUBLIC_GEMINI_KEY_6=AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk` to your hosting platform
2. Redeploy frontend
3. Test the same way

---

## Current Status

- ✅ Code updated
- ✅ Environment variable set locally
- ✅ Frontend running
- ✅ Backend running
- ⏳ Waiting for hosted deployment

**Ready to test locally now!**
