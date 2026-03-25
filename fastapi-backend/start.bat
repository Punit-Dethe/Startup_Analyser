@echo off
REM Quick start script for FastAPI backend (Windows)

echo 🚀 Starting KORE FastAPI Backend...
echo.

REM Check if .env exists
if not exist .env (
    echo ⚠️  .env file not found!
    echo Creating from .env.example...
    copy .env.example .env
    echo.
    echo 📝 Please edit .env and add your GEMINI_API_KEY
    echo Then run this script again.
    exit /b 1
)

REM Check if GEMINI_API_KEY is configured
findstr /C:"GEMINI_API_KEY=your_gemini_api_key_here" .env >nul
if %errorlevel% equ 0 (
    echo ⚠️  GEMINI_API_KEY not configured!
    echo Please edit .env and add your actual API key
    exit /b 1
)

echo ✓ GEMINI_API_KEY configured
echo.

REM Check if dependencies are installed
python -c "import fastapi" 2>nul
if %errorlevel% neq 0 (
    echo 📦 Installing dependencies...
    pip install -r requirements.txt
)

echo.
echo ✓ All checks passed!
echo.
echo Starting server on http://localhost:8000
echo API docs: http://localhost:8000/docs
echo Health check: http://localhost:8000/health
echo.
echo Press Ctrl+C to stop
echo.

uvicorn app.main:app --reload --port 8000
