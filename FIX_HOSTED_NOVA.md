# Fix Nova on Hosted Version

## The Problem

When you select Nova on the hosted version, it shows "using backend default" because:

1. Nova's `id` in the code is: `process.env.NEXT_PUBLIC_GEMINI_KEY_6`
2. In the hosted environment, `NEXT_PUBLIC_GEMINI_KEY_6` is **not set**
3. So `process.env.NEXT_PUBLIC_GEMINI_KEY_6` returns `undefined`
4. Which becomes `null` in the code
5. When you click Nova, it passes `null` to `handleApiKeyChange(null)`
6. Which removes the key from localStorage (goes to default)

## The Solution

**Add the environment variable to your hosted frontend.**

---

## Step-by-Step Fix

### Step 1: Check Current Keys (Diagnostic)

Visit this URL on your hosted site:
```
https://your-site.com/api/check-keys
```

You'll see which keys are set:
```json
{
  "keys": {
    "KEY_1": "AIzaSyDwN5Noz1W-z6wm...",  // Leo
    "KEY_2": "AIzaSyAw40Osfw1IQzHZ...",  // Max
    "KEY_3": "AIzaSyCN-jBh4akNZqxZ...",  // Sam
    "KEY_4": "AIzaSyC7TrCKOoyRROLg...",  // Alex
    "KEY_5": "AIzaSyCXQZYPrBTZJz1E...",  // Jordan
    "KEY_6": "NOT SET"                    // Nova ← THIS IS THE PROBLEM
  }
}
```

### Step 2: Add Environment Variable

Go to your hosting platform and add:

#### For Vercel:
1. Go to your project dashboard
2. Click "Settings"
3. Click "Environment Variables"
4. Add new variable:
   - **Name:** `NEXT_PUBLIC_GEMINI_KEY_6`
   - **Value:** `AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk`
   - **Environments:** Production, Preview, Development (check all)
5. Click "Save"

#### For Netlify:
1. Go to Site settings
2. Click "Environment variables"
3. Click "Add a variable"
4. Add:
   - **Key:** `NEXT_PUBLIC_GEMINI_KEY_6`
   - **Value:** `AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk`
5. Click "Create variable"

#### For Other Platforms:
Find the environment variables section and add:
```
NEXT_PUBLIC_GEMINI_KEY_6=AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk
```

### Step 3: Redeploy

After adding the environment variable, you MUST redeploy:

#### Vercel:
1. Go to "Deployments"
2. Click the three dots on the latest deployment
3. Click "Redeploy"

#### Netlify:
1. Go to "Deploys"
2. Click "Trigger deploy"
3. Click "Deploy site"

#### Other:
Trigger a new deployment through your platform's interface.

### Step 4: Verify

After redeployment:

1. Visit `https://your-site.com/api/check-keys` again
2. You should now see:
   ```json
   {
     "keys": {
       ...
       "KEY_6": "AIzaSyCxbNc7Idf3UStf..."  // ✅ NOW SET
     }
   }
   ```

3. Open your site
4. Open browser console (F12)
5. Click AI icon → Select Nova
6. Console should show:
   ```
   [KORE] API Key switched to: Nova
   [KORE] API Key value: AIzaSyCxbNc7Idf3UStf...
   ```

7. Generate a dashboard
8. Console should show:
   ```
   [KORE] Using custom API key: AIzaSyCxbNc7Idf3UStf...
   ```

---

## Why Leo/Max/Sam/Alex/Jordan Work But Nova Doesn't

They work because their environment variables (`NEXT_PUBLIC_GEMINI_KEY_1` through `NEXT_PUBLIC_GEMINI_KEY_5`) are already set in your hosted environment.

Nova doesn't work because `NEXT_PUBLIC_GEMINI_KEY_6` is not set yet.

---

## Common Mistakes

❌ **Adding to backend environment** - Won't work, keys are in frontend  
❌ **Typo in variable name** - Must be exactly `NEXT_PUBLIC_GEMINI_KEY_6`  
❌ **Not redeploying** - Changes only apply after redeploy  
❌ **Wrong value** - Must be the full API key starting with `AIzaSy...`  

---

## Verification Checklist

- [ ] Environment variable added to hosting platform
- [ ] Variable name is exactly `NEXT_PUBLIC_GEMINI_KEY_6`
- [ ] Value is `AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk`
- [ ] Applied to all environments (Production, Preview, Development)
- [ ] Site redeployed after adding variable
- [ ] `/api/check-keys` shows KEY_6 is set
- [ ] Nova appears in dropdown with pink dot
- [ ] Selecting Nova shows correct key in console
- [ ] Dashboard generation works with Nova

---

## Still Not Working?

If Nova still doesn't work after following all steps:

1. **Clear browser cache** - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check console** - Look for any error messages
3. **Verify deployment** - Make sure the latest deployment succeeded
4. **Check variable name** - Must be exactly `NEXT_PUBLIC_GEMINI_KEY_6` (case-sensitive)
5. **Check value** - Must be the full API key (starts with `AIzaSy`)

---

## Summary

**Problem:** `NEXT_PUBLIC_GEMINI_KEY_6` not set in hosted environment  
**Solution:** Add the environment variable and redeploy  
**Verification:** Visit `/api/check-keys` to confirm  

**This is the ONLY thing preventing Nova from working on the hosted version.**
