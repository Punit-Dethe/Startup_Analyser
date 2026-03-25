#!/bin/bash
echo "PORT environment variable: ${PORT}"
echo "Starting uvicorn on port ${PORT:-8000}"
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
