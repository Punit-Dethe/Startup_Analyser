# Why Nova Doesn't Work on Hosted Version

## Visual Explanation

### What Happens When You Click Leo (Working)

```
1. You click "Leo"
   ↓
2. Code reads: process.env.NEXT_PUBLIC_GEMINI_KEY_1
   ↓
3. Hosted env has: NEXT_PUBLIC_GEMINI_KEY_1=AIzaSyDwN5Noz1W-z6wmVEWpbNEO53NR6lKHF5w
   ↓
4. Returns: "AIzaSyDwN5Noz1W-z6wmVEWpbNEO53NR6lKHF5w"
   ↓
5. Stores in localStorage: "AIzaSyDwN5Noz1W-z6wmVEWpbNEO53NR6lKHF5w"
   ↓
6. Sends to backend: X-Gemini-API-Key: AIzaSyDwN5Noz1W-z6wmVEWpbNEO53NR6lKHF5w
   ↓
7. ✅ Works!
```

### What Happens When You Click Nova (Broken)

```
1. You click "Nova"
   ↓
2. Code reads: process.env.NEXT_PUBLIC_GEMINI_KEY_6
   ↓
3. Hosted env has: NEXT_PUBLIC_GEMINI_KEY_6 = ❌ NOT SET
   ↓
4. Returns: null
   ↓
5. Code sees null → removes from localStorage
   ↓
6. Sends to backend: (no header)
   ↓
7. Backend uses default key
   ↓
8. ❌ Shows "using backend default"
```

---

## The Code

### SettingsDropdown.tsx
```typescript
const API_KEYS = [
  { id: null, label: 'Default', color: '#000000' },
  { id: process.env.NEXT_PUBLIC_GEMINI_KEY_1, label: 'Leo', ... },    // ✅ Set
  { id: process.env.NEXT_PUBLIC_GEMINI_KEY_2, label: 'Max', ... },    // ✅ Set
  { id: process.env.NEXT_PUBLIC_GEMINI_KEY_3, label: 'Sam', ... },    // ✅ Set
  { id: process.env.NEXT_PUBLIC_GEMINI_KEY_4, label: 'Alex', ... },   // ✅ Set
  { id: process.env.NEXT_PUBLIC_GEMINI_KEY_5, label: 'Jordan', ... }, // ✅ Set
  { id: process.env.NEXT_PUBLIC_GEMINI_KEY_6, label: 'Nova', ... },   // ❌ NOT SET
]
```

### When You Click Nova
```typescript
onClick={() => {
  handleApiKeyChange(key.id)  // key.id is null for Nova
}}

const handleApiKeyChange = (keyId: string | null) => {
  if (keyId) {
    // This branch is for Leo, Max, Sam, Alex, Jordan
    localStorage.setItem('currentGeminiApiKey', keyId)
  } else {
    // Nova goes here because keyId is null
    localStorage.removeItem('currentGeminiApiKey')  // ← Removes key!
    console.log('Using backend default')            // ← This is what you see
  }
}
```

---

## The Fix

### On Your Hosting Platform

Add this environment variable:
```
NEXT_PUBLIC_GEMINI_KEY_6=AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk
```

Then redeploy.

### After Fix

```
1. You click "Nova"
   ↓
2. Code reads: process.env.NEXT_PUBLIC_GEMINI_KEY_6
   ↓
3. Hosted env has: NEXT_PUBLIC_GEMINI_KEY_6=AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk
   ↓
4. Returns: "AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk"
   ↓
5. Stores in localStorage: "AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk"
   ↓
6. Sends to backend: X-Gemini-API-Key: AIzaSyCxbNc7Idf3UStf8MfSjEnvrNgcupG2Suk
   ↓
7. ✅ Works!
```

---

## How to Verify

### Before Fix
Visit: `https://your-site.com/api/check-keys`
```json
{
  "keys": {
    "KEY_1": "AIzaSyDwN5Noz1W-z6wm...",
    "KEY_2": "AIzaSyAw40Osfw1IQzHZ...",
    "KEY_3": "AIzaSyCN-jBh4akNZqxZ...",
    "KEY_4": "AIzaSyC7TrCKOoyRROLg...",
    "KEY_5": "AIzaSyCXQZYPrBTZJz1E...",
    "KEY_6": "NOT SET"  ← Problem
  }
}
```

### After Fix
Visit: `https://your-site.com/api/check-keys`
```json
{
  "keys": {
    "KEY_1": "AIzaSyDwN5Noz1W-z6wm...",
    "KEY_2": "AIzaSyAw40Osfw1IQzHZ...",
    "KEY_3": "AIzaSyCN-jBh4akNZqxZ...",
    "KEY_4": "AIzaSyC7TrCKOoyRROLg...",
    "KEY_5": "AIzaSyCXQZYPrBTZJz1E...",
    "KEY_6": "AIzaSyCxbNc7Idf3UStf..."  ← Fixed!
  }
}
```

---

## Summary

**The code is correct.**  
**The local setup is correct.**  
**The only issue is the missing environment variable on the hosted platform.**

Add `NEXT_PUBLIC_GEMINI_KEY_6` to your hosting platform's environment variables and redeploy. That's it!
