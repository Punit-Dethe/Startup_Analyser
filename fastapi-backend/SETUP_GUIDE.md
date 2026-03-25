# FastAPI Backend Setup Guide

## Quick Start (3 Steps)

### 1. Install Dependencies

```bash
cd fastapi-backend
python -m pip install -r requirements.txt
```

### 2. Configure API Key

Edit `.env` file and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

### 3. Run the Server

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Or manually:**
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The server will start at: http://localhost:8000

## Verify Installation

### Test Imports
```bash
python test_imports.py
```

### Test Health Endpoint
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "gemini_configured": true
}
```

### Test Generate Endpoint
```bash
curl -X POST http://localhost:8000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"query": "Show me startup funding trends"}'
```

### Test Chat Endpoint
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Tell me more about Series A funding",
    "history": [],
    "context": {
      "subject": "Startup Funding",
      "active_tab": "overview",
      "visible_modules": []
    }
  }'
```

## Configuration Options

All configuration is done via environment variables in `.env`:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | - | Your Gemini API key |
| `FRONTEND_URL` | No | `http://localhost:3000` | Frontend URL for CORS |
| `PORT` | No | `8000` | Server port |
| `ENVIRONMENT` | No | `development` | Environment (development/production/staging) |
| `LOG_LEVEL` | No | `INFO` | Log level (DEBUG/INFO/WARNING/ERROR/CRITICAL) |
| `RATE_LIMIT_PER_MINUTE` | No | `60` | API rate limit |

## Deployment

### Railway (Recommended)

1. Push code to GitHub
2. Connect repository to Railway
3. Set environment variables in Railway dashboard:
   - `GEMINI_API_KEY`
   - `FRONTEND_URL` (your production frontend URL)
4. Railway will automatically deploy using `railway.json`

### Render

1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Render will automatically deploy using `render.yaml`

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`
3. Set environment variables in Vercel dashboard

See `vercel_deploy.md` for detailed Vercel instructions.

## Troubleshooting

### Import Errors
```bash
python test_imports.py
```
If any imports fail, reinstall dependencies:
```bash
python -m pip install -r requirements.txt --force-reinstall
```

### API Key Not Configured
Check `.env` file exists and contains valid `GEMINI_API_KEY`

### Port Already in Use
Change `PORT` in `.env` or use a different port:
```bash
python -m uvicorn app.main:app --port 8001
```

### CORS Errors
Update `FRONTEND_URL` in `.env` to match your frontend URL

## Next Steps

1. Update frontend to use FastAPI backend (see `READY_TO_TEST.md`)
2. Deploy to Railway/Render
3. Update frontend environment variables
4. Test end-to-end

## Documentation

- `README.md` - Project overview
- `QUICKSTART.md` - Detailed setup instructions
- `READY_TO_TEST.md` - Testing checklist
- `vercel_deploy.md` - Vercel deployment guide
