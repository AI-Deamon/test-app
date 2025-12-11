FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH="/app:/app/src"

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy ALL application files (this was missing!)
COPY main.py .
COPY wazuh_client.py .
COPY mcp_protocol.py .
# .env file will be mounted as volume or provided at runtime
COPY src/ ./src/

# Create non-root user
RUN useradd -m wazuh && chown -R wazuh:wazuh /app
USER wazuh

# Run the server
CMD ["python", "main.py"]
