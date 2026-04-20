# 🚀 KORE Dashboard - User Setup Guide

This guide will help you set up and run KORE Dashboard on your local computer.

---

## 📋 Prerequisites

Before you start, make sure you have:

1. **Python 3.9+** installed ([Download here](https://www.python.org/downloads/))
2. **Node.js 18+** installed ([Download here](https://nodejs.org/))
3. **A Gemini API Key** (free) - [Get it here](https://makersuite.google.com/app/apikey)

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Get a Gemini API Key (Free)

1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key (starts with `AIzaSy...`)

### Step 2: Configure Backend

1. Open `fastapi-backend` folder
2. Create a file named `.env` (copy from `.env.example`)
3. Add your API key:
   ```env
   GEMINI_API_KEY=AIzaSy_your_actual_key_here
   ```

### Step 3: Configure Frontend

1. Open `kore-frontend` folder
2. Open `.env.local` file
3. Replace `NEXT_PUBLIC_GEMINI_KEY_1` with your Gemini API key:
   ```env
   NEXT_PUBLIC_GEMINI_KEY_1=AIzaSy_your_actual_key_here
   ```

### Step 4: Install Dependencies

**Backend:**
```bash
cd fastapi-backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd kore-frontend
npm install
```

### Step 5: Start Both Servers

**Backend (Terminal 1):**
```bash
cd fastapi-backend
python -m uvicorn app.main:app --reload --port 8000
```

**Frontend (Terminal 2):**
```bash
cd kore-frontend
npm run dev
```

### Step 6: Open the App

Open your browser and go to: **http://localhost:3000**

---

## ✅ Verify Everything Works

1. **Backend Health Check:**
   - Open: http://localhost:8000/health
   - Should see: `{"status": "healthy", ...}`

2. **Frontend:**
   - Open: http://localhost:3000
   - Should see the KORE landing page

3. **Generate a Dashboard:**
   - Select "Startup Analysis" or "Company Analysis"
   - Enter a prompt (e.g., "Food delivery startup in India")
   - Click "Analyse"
   - Wait 15-30 seconds for the dashboard to generate

---

## 🎯 What You Get

- **Startup Analysis Mode**: Analyze startup ideas with Lean Canvas, TAM/SAM/SOM, SWOT, etc.
- **Company Analysis Mode**: Analyze existing companies with business model, market position, etc.
- **AI Chat**: Ask questions about the generated dashboard
- **Multiple API Keys**: Switch between different Gemini API keys if you hit rate limits

---

## 🔑 API Key Management

### Free Tier Limits (Gemini)
- **gemini-2.5-flash**: 20 requests/day (default)
- **gemini-1.5-flash**: 1500 requests/day (recommended)

### Using Multiple Keys

If you have multiple Gemini API keys, add them to `kore-frontend/.env.local`:

```env
NEXT_PUBLIC_GEMINI_KEY_1=AIzaSy_key_1_here
NEXT_PUBLIC_GEMINI_KEY_2=AIzaSy_key_2_here
NEXT_PUBLIC_GEMINI_KEY_3=AIzaSy_key_3_here
NEXT_PUBLIC_GEMINI_KEY_4=AIzaSy_key_4_here
NEXT_PUBLIC_GEMINI_KEY_5=AIzaSy_key_5_here
```

Then switch between them in the UI using the settings dropdown.

---

## 🐛 Common Issues

### "Module not found" Error
```bash
cd fastapi-backend
pip install -r requirements.txt --force-reinstall
```

### "Port already in use"
```bash
# Backend: Use a different port
python -m uvicorn app.main:app --reload --port 8001

# Frontend: Kill the process using port 3000
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -ti:3000 | xargs kill
```

### "API Key not configured"
- Make sure `.env` file exists in `fastapi-backend` folder
- Make sure it contains `GEMINI_API_KEY=your_key_here`
- Restart the backend server after adding the key

### "Rate limit exceeded"
- You've hit the daily limit for your API key
- Wait 24 hours, or add another API key
- Consider upgrading to gemini-1.5-flash (1500 requests/day)

### Dashboard generation fails
- Check backend logs in Terminal 1
- Make sure your API key is valid
- Try a simpler prompt first
- Check your internet connection

---

## 🎨 Customization

### Change Default Model

Edit `fastapi-backend/.env`:
```env
# Use gemini-1.5-flash for higher rate limits
GEMINI_MODEL=gemini-1.5-flash
```

### Change Port Numbers

**Backend:**
```bash
python -m uvicorn app.main:app --reload --port 8001
```

Then update `kore-frontend/.env.local`:
```env
NEXT_PUBLIC_FASTAPI_BASE_URL=http://localhost:8001
```

---

## 📊 Performance

- **Simple queries**: 15-30 seconds
- **Complex queries**: 30-60 seconds
- **Very complex queries**: Up to 3 minutes

---

## 🔒 Privacy & Security

- All data processing happens locally on your computer
- Your API key is stored only in your local `.env` files
- No data is sent to any third-party servers except Google Gemini API
- You can disconnect from the internet after setup (except when generating dashboards)

---

## 💡 Tips

1. **Start with simple prompts** to test the system
2. **Use specific details** for better results (budget, location, target market)
3. **Switch API keys** if you hit rate limits
4. **Keep both servers running** while using the app
5. **Check backend logs** (Terminal 1) if something goes wrong

---

## 🆘 Need Help?

1. Check the backend logs in Terminal 1
2. Check the frontend logs in Terminal 2
3. Open browser console (F12) for frontend errors
4. Verify your API key is valid at https://makersuite.google.com/app/apikey

---

## 🎉 You're Ready!

Open http://localhost:3000 and start analyzing startups and companies!

**Example Prompts to Try:**
- "Food delivery startup in India with ₹50L budget"
- "AI-powered mental health app for Gen-Z"
- "Analyze Tesla's business model"
- "Compare Zomato and Swiggy market positioning"
