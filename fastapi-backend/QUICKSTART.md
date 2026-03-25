# Quick Start Guide

Get the FastAPI backend running in 5 minutes!

## Prerequisites

- Python 3.11 or higher
- Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Step 1: Install Dependencies

```bash
cd fastapi-backend
pip install -r requirements.txt
```

## Step 2: Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_api_key_here
FRONTEND_URL=http://localhost:3000
```

## Step 3: Test the Backend

Run the test script to verify everything works:

```bash
python test_local.py
```

You should see:
```
✓ Dashboard generated successfully!
✓ Chat processed successfully!
🎉 All tests passed! Backend is ready to use.
```

## Step 4: Start the Server

```bash
uvicorn app.main:app --reload --port 8000
```

The server will start at `http://localhost:8000`

## Step 5: Test the API

Open your browser and visit:

- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "gemini_configured": true
}
```

## Step 6: Test with Frontend

Update your frontend `.env.local`:

```bash
BACKEND_TYPE=fastapi
FASTAPI_BASE_URL=http://localhost:8000
```

Restart your frontend and test dashboard generation!

## Troubleshooting

### "GEMINI_API_KEY not configured"

Make sure you:
1. Created the `.env` file
2. Added your actual API key (not the placeholder)
3. Restarted the server after adding the key

### "Module not found" errors

Make sure you're in the `fastapi-backend` directory and installed dependencies:
```bash
cd fastapi-backend
pip install -r requirements.txt
```

### Port 8000 already in use

Change the port:
```bash
uvicorn app.main:app --reload --port 8001
```

And update `FASTAPI_BASE_URL` in frontend to `http://localhost:8001`

## Next Steps

- Deploy to Railway or Render (see README.md)
- Configure frontend to use FastAPI backend
- Run migration tests

## Need Help?

Check the full README.md for detailed documentation and deployment instructions.
