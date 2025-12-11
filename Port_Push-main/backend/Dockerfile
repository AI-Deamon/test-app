FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

# Required on Kali/Ubuntu due to external-package management
RUN pip install --break-system-packages --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["python3", "app.py"]
