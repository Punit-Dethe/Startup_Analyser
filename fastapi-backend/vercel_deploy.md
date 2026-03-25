# Deploying to Vercel

## Quick Deploy

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy from fastapi-backend directory

```bash
cd fastapi-backend
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? **kore-backend** (or your choice)
- Directory? **.** (current directory)
- Override settings? **N**

### 4. Set Environment Variables

```bash
vercel env add GEMINI_API_KEY
# Paste your API key when prompted

vercel env add FRONTEND_URL
# Enter your frontend URL: https://your-frontend.vercel.app

vercel env add ENVIRONMENT
# Enter: production
```

### 5. Deploy to Production

```bash
vercel --prod
```

## Important Notes

### Vercel Limitations

⚠️ **Timeout Limits:**
- Free tier: 10 seconds max
- Pro tier: 60 seconds max

Since dashboard generation can take 15-30 seconds, you'll need:
- **Vercel Pro** ($20/month) for 60-second timeout
- OR use Railway/Render for longer timeouts

### Recommended: Use Railway or Render Instead

For this use case, **Railway or Render are better** because:
- ✅ No timeout limits
- ✅ Persistent connections
- ✅ Better for long-running AI requests
- ✅ Free tier available

## Alternative: Deploy to Railway (Recommended)

Railway is better suited for this backend:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd fastapi-backend
railway init

# Add environment variables
railway variables set GEMINI_API_KEY=your_key
railway variables set FRONTEND_URL=https://your-frontend.vercel.app

# Deploy
railway up
```

Railway will:
- Auto-detect Dockerfile
- Build and deploy
- Provide a public URL
- No timeout limits!

## Update Frontend

Once deployed, update your frontend `.env.local`:

```bash
BACKEND_TYPE=fastapi
FASTAPI_BASE_URL=https://your-backend.railway.app
# or
FASTAPI_BASE_URL=https://your-backend.vercel.app
```

## Vercel vs Railway Comparison

| Feature | Vercel | Railway |
|---------|--------|---------|
| Timeout (Free) | 10s ❌ | No limit ✅ |
| Timeout (Paid) | 60s ($20/mo) | No limit ✅ |
| Cold starts | Yes | Minimal |
| Best for | Static/SSR | APIs/Backends |
| Our use case | Not ideal | Perfect ✅ |

## Recommendation

**Use Railway for the backend** because:
1. Dashboard generation takes 15-30 seconds
2. No timeout limits
3. Better for long-running AI requests
4. Free tier is sufficient

**Keep Vercel for the frontend** because:
1. Perfect for Next.js
2. Fast global CDN
3. Automatic deployments

This gives you the best of both worlds! 🚀
