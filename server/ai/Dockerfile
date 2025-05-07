# Use lightweight Python image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy & install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your code
COPY . .

# Run Flask app with Gunicorn
CMD ["gunicorn", "-w", "8", "-b", "0.0.0.0:8080", "Flask_app:app" , "--threads", "2", "--timeout", "120"]


