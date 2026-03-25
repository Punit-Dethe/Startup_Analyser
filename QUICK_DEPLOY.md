# ⚡ Quick Deploy Commands

## 1. Push to GitHub

```powershell
# Create repo on GitHub first: https://github.com/new
# Then run these commands (replace YOUR_USERNAME):

git remote add origin https://github.com/YOUR_USERNAME/kore-dashboard.git
git branch -M main
git push -u origin main
```

## 2. Deploy Backend (Railway)

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select `kore-dashboard` repo
4. Set Root Directory: `fastapi-backend`
5. Add environment variables:
   ```
   GEMINI_API_KEY=your_key_here
   FRONTEND_URL=https://your-frontend.vercel.app
   ENVIRONMENT=production
   ```
6. Deploy!
7. Copy your Railway URL: `https://your-app.railway.app`

## 3. Deploy Frontend (Vercel)

1. Go to https://vercel.com
2. Click "Add New..." → "Project"
3. Select `kore-dashboard` repo
4. Set Root Directory: `kore-frontend`
5. Add environment variables:
   ```
   NEXT_PUBLIC_BACKEND_TYPE=fastapi
   NEXT_PUBLIC_FASTAPI_BASE_URL=https://your-app.railway.app
   ```
6. Deploy!
7. Copy your Vercel URL: `https://your-app.vercel.app`

## 4. Update Backend CORS

1. Go back to Railway
2. Update `FRONTEND_URL` to your Vercel URL
3. Railway will auto-redeploy

## 5. Test

Open your Vercel URL and try:
- "Show me Apple Inc"
- Wait 30-60 seconds
- Dashboard should appear!

## Done! 🎉

Your app is live at: `https://your-app.vercel.app`

---

## Update Your App

```powershell
git add .
git commit -m "Update message"
git push origin main
```

Both Railway and Vercel auto-deploy on push!
