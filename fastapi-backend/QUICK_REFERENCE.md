# FastAPI Backend Quick Reference

## 🚀 Quick Commands

### Start Server
```bash
# Windows
start.bat

# Linux/Mac
./start.sh

# Manual
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Test
```bash
# Test imports
python test_imports.py

# Test health
curl http://localhost:8000/health

# Test generate
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"query": "Show me startup trends"}'

# Test chat
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me more", "history": [], "context": {"subject": "Startups", "active_tab": "overview", "visible_modules": []}}'
```

### Install/Update
```bash
# Install dependencies
python -m pip install -r requirements.txt

# Force reinstall
python -m pip install -r requirements.txt --force-reinstall

# Update pip
python -m pip install --upgrade pip
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `.env` | Environment configuration (API key) |
| `app/main.py` | FastAPI application |
| `app/config.py` | Settings and configuration |
| `app/api/generate.py` | Dashboard generation endpoint |
| `app/api/chat.py` | Chat endpoint |
| `app/integrations/gemini_client.py` | Gemini API client |
| `prompts/generate.md` | Dashboard generation prompt |
| `prompts/chat.md` | Chat prompt |
| `requirements.txt` | Python dependencies |

## 🔌 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/api/generate` | POST | Generate dashboard |
| `/api/chat` | POST | Chat interaction |
| `/docs` | GET | API documentation (Swagger) |
| `/redoc` | GET | API documentation (ReDoc) |

## ⚙️ Environment Variables

| Variable | Required | Default | Example |
|----------|----------|---------|---------|
| `GEMINI_API_KEY` | ✅ Yes | - | `AIzaSy...` |
| `FRONTEND_URL` | No | `http://localhost:3000` | `https://app.example.com` |
| `PORT` | No | `8000` | `8000` |
| `ENVIRONMENT` | No | `development` | `production` |
| `LOG_LEVEL` | No | `INFO` | `DEBUG` |

## 🚢 Deployment URLs

### Railway
```bash
# Deploy
git push origin main

# View logs
railway logs

# Set env var
railway variables set GEMINI_API_KEY=your_key
```

### Render
```bash
# Deploy
git push origin main

# View logs
# (Use Render dashboard)
```

### Vercel
```bash
# Deploy
vercel --prod

# View logs
vercel logs
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Import errors | `python -m pip install -r requirements.txt --force-reinstall` |
| API key not configured | Check `.env` file exists and has valid `GEMINI_API_KEY` |
| Port already in use | Change `PORT` in `.env` or use `--port 8001` |
| CORS errors | Update `FRONTEND_URL` in `.env` |
| Module not found | Make sure you're in `fastapi-backend/` directory |
| Timeout errors | Check Gemini API is responding, increase timeout if needed |

## 📊 Performance Targets

| Metric | Target | Actual (n8n) |
|--------|--------|--------------|
| Dashboard Generation | < 30s | 2-3 minutes |
| Chat Response | < 20s | 30-60 seconds |
| Health Check | < 1s | N/A |
| Uptime | > 99% | - |

## 📖 Documentation

| File | Purpose |
|------|---------|
| `README.md` | Project overview |
| `SETUP_GUIDE.md` | Setup instructions |
| `DEPLOYMENT_CHECKLIST.md` | Deployment checklist |
| `YOURE_READY.md` | Final deployment guide |
| `QUICK_REFERENCE.md` | This file |

## 🔗 Useful Links

- **Gemini API**: https://makersuite.google.com/app/apikey
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Vercel**: https://vercel.com
- **FastAPI Docs**: https://fastapi.tiangolo.com

## 💡 Tips

1. **Always test locally first** before deploying
2. **Keep n8n running** during initial rollout for rollback
3. **Monitor logs** closely after deployment
4. **Use Railway/Render** for production (no timeout limits)
5. **Set LOG_LEVEL=DEBUG** for troubleshooting
6. **Check health endpoint** before testing other endpoints
7. **Use API docs** at `/docs` for interactive testing

## 🎯 Success Checklist

- [ ] Dependencies installed
- [ ] `.env` configured with API key
- [ ] Server starts without errors
- [ ] Health endpoint returns healthy
- [ ] Generate endpoint creates dashboards
- [ ] Chat endpoint responds correctly
- [ ] Deployed to Railway/Render
- [ ] Frontend connected
- [ ] End-to-end testing complete

---

**Need more help?** See [SETUP_GUIDE.md](SETUP_GUIDE.md) or [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
