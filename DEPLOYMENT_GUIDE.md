# 🚀 Complete Deployment Guide

## Overview

You'll deploy:
1. **Backend (FastAPI)** → Railway (no timeout limits)
2. **Frontend (Next.js)** → Vercel (optimized for Next.js)

Total time: ~15 minutes

---

## Step 1: Push to GitHub

### 1.1 Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `kore-dashboard` (or any name you like)
3. Description: "AI-powered dashboard generator with FastAPI backend"
4. **Keep it Private** (recommended since it has your code)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### 1.2 Push Your Code

Copy the commands from GitHub (they'll look like this):

```bash
git remote add origin https://github.com/YOUR_USERNAME/kore-dashboard.git
git branch -M main
git push -u origin main
```

Run them in your terminal:

```powershell
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/kore-dashboard.git
git branch -M main
git push -u origin main
```

You'll be asked to authenticate - use your GitHub credentials or personal access token.

---

## Step 2: Deploy Backend to Railway

### 2.1 Sign Up for Railway

1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign in with GitHub
4. Authorize Railway to access your repositories

### 2.2 Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your `kore-dashboard` repository
4. Railway will detect it's a monorepo

### 2.3 Configure Backend Service

1. Railway will ask which directory to deploy
2. Select `fastapi-backend` directory
3. Or manually set:
   - **Root Directory**: `fastapi-backend`
   - **Build Command**: (leave empty, Railway auto-detects)
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 2.4 Set Environment Variables

1. In Railway dashboard, click on your service
2. Go to "Variables" tab
3. Add these variables:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
FRONTEND_URL=https://your-frontend-url.vercel.app
ENVIRONMENT=production
LOG_LEVEL=INFO
```

**Important**: 
- Get your Gemini API key from: https://makersuite.google.com/app/apikey
- You'll update `FRONTEND_URL` after deploying the frontend

### 2.5 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Railway will give you a URL like: `https://your-app.railway.app`
4. **Copy this URL** - you'll need it for the frontend!

### 2.6 Test Backend

Open your Railway URL in browser:
- Health check: `https://your-app.railway.app/health`
- Should see: `{"status":"healthy","gemini_configured":true}`

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Sign Up for Vercel

1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign in with GitHub
4. Authorize Vercel to access your repositories

### 3.2 Import Project

1. Click "Add New..." → "Project"
2. Select your `kore-dashboard` repository
3. Vercel will detect it's a Next.js app

### 3.3 Configure Frontend

1. **Root Directory**: `kore-frontend`
2. **Framework Preset**: Next.js (auto-detected)
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `.next` (auto-detected)

### 3.4 Set Environment Variables

Click "Environment Variables" and add:

```
NEXT_PUBLIC_BACKEND_TYPE=fastapi
NEXT_PUBLIC_FASTAPI_BASE_URL=https://your-app.railway.app
```

**Replace** `https://your-app.railway.app` with your actual Railway URL from Step 2.5!

### 3.5 Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Vercel will give you a URL like: `https://your-app.vercel.app`
4. **Copy this URL**

### 3.6 Update Backend CORS

1. Go back to Railway dashboard
2. Update the `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Railway will automatically redeploy

---

## Step 4: Test Everything

### 4.1 Test Frontend

1. Open your Vercel URL: `https://your-app.vercel.app`
2. You should see the KORE dashboard interface
3. Try generating a dashboard: "Show me Apple Inc"
4. Wait 30-60 seconds
5. Dashboard should appear!

### 4.2 Test Chat

1. After dashboard loads, try chatting
2. Ask: "Tell me more about revenue"
3. Should get a response in 10-20 seconds

### 4.3 Test Temporary Tabs

1. Ask: "Show me competitors"
2. A new temporary tab should appear
3. Tab should have content (not blank)

---

## Step 5: Monitor & Troubleshoot

### Railway Logs

1. Go to Railway dashboard
2. Click on your service
3. Click "Deployments" → Latest deployment
4. Click "View Logs"
5. You'll see real-time logs of API requests

### Vercel Logs

1. Go to Vercel dashboard
2. Click on your project
3. Click "Deployments" → Latest deployment
4. Click "View Function Logs"
5. You'll see Next.js API route logs

### Common Issues

#### Issue: "Backend not configured"
**Solution**: Check environment variables in Vercel
- Make sure `NEXT_PUBLIC_BACKEND_TYPE=fastapi`
- Make sure `NEXT_PUBLIC_FASTAPI_BASE_URL` is set correctly

#### Issue: CORS errors
**Solution**: Update `FRONTEND_URL` in Railway to match your Vercel URL exactly

#### Issue: "Gemini API key not configured"
**Solution**: Check `GEMINI_API_KEY` in Railway environment variables

#### Issue: Timeout errors
**Solution**: Railway has no timeout limits, but check:
- Gemini API is responding
- Query isn't too complex
- Check Railway logs for errors

---

## Step 6: Custom Domain (Optional)

### For Frontend (Vercel)

1. Go to Vercel dashboard → Your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow Vercel's DNS instructions
5. Update `FRONTEND_URL` in Railway to your custom domain

### For Backend (Railway)

1. Go to Railway dashboard → Your service
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow Railway's DNS instructions
5. Update `NEXT_PUBLIC_FASTAPI_BASE_URL` in Vercel to your custom domain

---

## 📊 Costs

### Railway
- **Free tier**: $5 credit/month
- **Paid tier**: $5/month for 500 hours
- **Your usage**: ~$2-5/month (depending on traffic)

### Vercel
- **Free tier**: Unlimited for personal projects
- **Paid tier**: $20/month (only if you need more)
- **Your usage**: Free tier should be enough

### Gemini API
- **Free tier**: 60 requests/minute
- **Paid tier**: Pay per token
- **Your usage**: Depends on how many dashboards you generate

**Total estimated cost**: $0-5/month for low traffic

---

## 🎉 You're Live!

Your KORE Dashboard is now deployed and accessible worldwide!

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.railway.app
- **Performance**: 10x faster than n8n (15-30 seconds vs 2-3 minutes)

### Next Steps

1. Share your app with users
2. Monitor usage in Railway/Vercel dashboards
3. Check logs regularly for errors
4. Update code by pushing to GitHub (auto-deploys!)

### Updating Your App

To update your app:

```bash
# Make changes to your code
git add .
git commit -m "Your update message"
git push origin main
```

Both Railway and Vercel will automatically detect the push and redeploy!

---

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Gemini API Docs**: https://ai.google.dev/docs

Check the logs first - they usually tell you exactly what's wrong!
