#!/bin/bash
# Quick start script for FastAPI backend

echo "🚀 Starting KORE FastAPI Backend..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating from .env.example..."
    cp .env.example .env
    echo ""
    echo "📝 Please edit .env and add your GEMINI_API_KEY"
    echo "Then run this script again."
    exit 1
fi

# Check if GEMINI_API_KEY is set
if ! grep -q "GEMINI_API_KEY=your_gemini_api_key_here" .env; then
    echo "✓ GEMINI_API_KEY configured"
else
    echo "⚠️  GEMINI_API_KEY not configured!"
    echo "Please edit .env and add your actual API key"
    exit 1
fi

# Check if dependencies are installed
if ! python -c "import fastapi" 2>/dev/null; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
fi

echo ""
echo "✓ All checks passed!"
echo ""
echo "Starting server on http://localhost:8000"
echo "API docs: http://localhost:8000/docs"
echo "Health check: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop"
echo ""

uvicorn app.main:app --reload --port 8000
