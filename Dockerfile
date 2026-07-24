# Production Dockerfile for Autonomous Career Agent
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements & install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Run test suite on build
RUN python -m unittest discover tests/

# Default entry point
CMD ["python", "src/sync_all_portals.py"]
