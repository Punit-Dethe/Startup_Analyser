# FastAPI Backend Deployment Checklist

## ✅ Pre-Deployment Checklist

### Local Testing
- [ ] All dependencies installed (`python -m pip install -r requirements.txt`)
- [ ] `.env` file created with valid `GEMINI_API_KEY`
- [ ] All imports successful (`python test_imports.py`)
- [ ] Server starts without errors (`start.bat` or `start.sh`)
- [ ] Health endpoint returns healthy status
- [ ] Generate endpoint creates valid dashboards
- [ ] Chat endpoint handles conversations

### Code Quality
- [ ] No syntax errors (`python -m py_compile app/**/*.py`)
- [ ] All required files present (see File Checklist below)
- [ ] System prompts copied to `prompts/` directory
- [ ] `.gitignore` configured properly

## 📁 File Checklist

### Core Application
- [ ] `app/__init__.py` (with `__version__`)
- [ ] `app/main.py` (FastAPI app)
- [ ] `app/config.py` (settings)
- [ ] `app/dependencies.py` (DI)

### API Endpoints
- [ ] `app/api/__init__.py`
- [ ] `app/api/health.py`
- [ ] `app/api/generate.py`
- [ ] `app/api/chat.py`

### Models
- [ ] `app/models/__init__.py`
- [ ] `app/models/requests.py`
- [ ] `app/models/responses.py`
- [ ] `app/models/dashboard.py`

### Services
- [ ] `app/services/__init__.py`
- [ ] `app/services/prompt_service.py`
- [ ] `app/services/generate_service.py`
- [ ] `app/services/chat_service.py`

### Integrations
- [ ] `app/integrations/__init__.py`
- [ ] `app/integrations/gemini_client.py`

### Validation
- [ ] `app/validation/__init__.py`
- [ ] `app/validation/dashboard_validator.py`
- [ ] `app/validation/chat_validator.py`

### Utilities
- [ ] `app/utils/__init__.py`
- [ ] `app/utils/logging.py`
- [ ] `app/utils/errors.py`

### System Prompts
- [ ] `prompts/generate.md`
- [ ] `prompts/chat.md`

### Configuration
- [ ] `requirements.txt`
- [ ] `.env.example`
- [ ] `.env` (local only, not in git)
- [ ] `.gitignore`
- [ ] `Dockerfile`

### Deployment Configs
- [ ] `railway.json` (Railway)
- [ ] `render.yaml` (Render)
- [ ] `vercel.json` (Vercel)
- [ ] `api/index.py` (Vercel serverless)

### Documentation
- [ ] `README.md`
- [ ] `QUICKSTART.md`
- [ ] `SETUP_GUIDE.md`
- [ ] `READY_TO_TEST.md`
- [ ] `vercel_deploy.md`
- [ ] `DEPLOYMENT_CHECKLIST.md` (this file)

### Scripts
- [ ] `start.bat` (Windows)
- [ ] `start.sh` (Linux/Mac)
- [ ] `test_local.py`
- [ ] `test_imports.py`

## 🚀 Deployment Steps

### Option 1: Railway (Recommended)

1. **Prepare Repository**
   - [ ] Push code to GitHub
   - [ ] Verify all files are committed
   - [ ] Check `.gitignore` excludes `.env`

2. **Railway Setup**
   - [ ] Create Railway account
   - [ ] Create new project
   - [ ] Connect GitHub repository
   - [ ] Select `fastapi-backend` directory

3. **Configure Environment**
   - [ ] Set `GEMINI_API_KEY` in Railway dashboard
   - [ ] Set `FRONTEND_URL` to production frontend URL
   - [ ] Set `ENVIRONMENT=production`
   - [ ] Set `LOG_LEVEL=INFO`

4. **Deploy**
   - [ ] Railway auto-deploys from `railway.json`
   - [ ] Wait for build to complete
   - [ ] Check deployment logs for errors

5. **Verify Deployment**
   - [ ] Test health endpoint: `https://your-app.railway.app/health`
   - [ ] Verify `gemini_configured: true`
   - [ ] Test generate endpoint with sample query
   - [ ] Test chat endpoint with sample message

### Option 2: Render

1. **Prepare Repository**
   - [ ] Push code to GitHub
   - [ ] Verify `render.yaml` is present

2. **Render Setup**
   - [ ] Create Render account
   - [ ] Create new Web Service
   - [ ] Connect GitHub repository
   - [ ] Select `fastapi-backend` directory

3. **Configure Environment**
   - [ ] Set environment variables in Render dashboard
   - [ ] `GEMINI_API_KEY`
   - [ ] `FRONTEND_URL`
   - [ ] `ENVIRONMENT=production`

4. **Deploy**
   - [ ] Render auto-deploys from `render.yaml`
   - [ ] Wait for build to complete
   - [ ] Check deployment logs

5. **Verify Deployment**
   - [ ] Test health endpoint
   - [ ] Test generate endpoint
   - [ ] Test chat endpoint

### Option 3: Vercel

⚠️ **Warning**: Vercel has timeout limits (60s max on Pro tier). Use Railway/Render for production.

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd fastapi-backend
   vercel --prod
   ```

3. **Configure Environment**
   - [ ] Set environment variables in Vercel dashboard
   - [ ] `GEMINI_API_KEY`
   - [ ] `FRONTEND_URL`

4. **Verify Deployment**
   - [ ] Test health endpoint
   - [ ] Test generate endpoint (may timeout)

## 🔗 Frontend Integration

### Update Frontend Environment Variables

Edit `kore-frontend/.env.local`:

```env
# Backend Configuration
BACKEND_TYPE=fastapi
FASTAPI_BASE_URL=https://your-backend-url.railway.app

# Legacy n8n (keep for rollback)
N8N_GENERATE_WEBHOOK=your_n8n_generate_webhook
N8N_CHAT_WEBHOOK=your_n8n_chat_webhook
```

### Update Frontend API Client

The frontend `src/lib/api.ts` should already support backend switching via `BACKEND_TYPE` environment variable.

### Test Frontend Integration

- [ ] Frontend connects to FastAPI backend
- [ ] Dashboard generation works (< 30 seconds)
- [ ] Chat works (< 20 seconds)
- [ ] Temporary tabs work
- [ ] All module types render correctly
- [ ] No CORS errors

## 📊 Post-Deployment Monitoring

### Performance Metrics
- [ ] Dashboard generation: < 30 seconds
- [ ] Chat response: < 20 seconds
- [ ] Health check: < 1 second
- [ ] No timeout errors

### Error Monitoring
- [ ] Check deployment logs daily
- [ ] Monitor error rates
- [ ] Track Gemini API usage
- [ ] Watch for rate limit errors

### User Feedback
- [ ] Collect user feedback on speed
- [ ] Monitor for any errors
- [ ] Compare with n8n performance

## 🔄 Rollback Plan

If issues occur, rollback to n8n:

1. **Frontend Rollback**
   ```env
   BACKEND_TYPE=n8n
   ```

2. **Redeploy Frontend**
   - [ ] Update environment variable
   - [ ] Redeploy frontend
   - [ ] Verify n8n backend works

3. **Keep FastAPI Running**
   - [ ] Don't shut down FastAPI
   - [ ] Debug issues
   - [ ] Fix and redeploy

## ✅ Success Criteria

- [ ] Backend deployed and healthy
- [ ] All endpoints responding correctly
- [ ] Frontend integrated successfully
- [ ] Response times < 30 seconds
- [ ] Zero downtime during migration
- [ ] Users report improved speed
- [ ] No increase in error rates

## 📝 Notes

- Keep n8n running during initial rollout
- Monitor logs closely for first 24 hours
- Have rollback plan ready
- Document any issues encountered
- Update this checklist based on experience
