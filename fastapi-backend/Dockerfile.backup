# Multi-stage Dockerfile for FastAPI backend

# Stage 1: Builder
FROM python:3.11-slim as builder

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Runtime
FROM python:3.11-slim

WORKDIR /app

# Copy dependencies from builder
COPY --from=builder /root/.local /root/.local

# Copy application code
COPY app/ ./app/
COPY prompts/ ./prompts/

# Set environment variables
ENV PATH=/root/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

# Expose port (Railway will set PORT dynamically)
EXPOSE 8000

# Run application (uses Railway's $PORT variable)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
