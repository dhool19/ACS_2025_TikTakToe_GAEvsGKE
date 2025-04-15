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
CMD ["gunicorn", "-b", ":8080", "Flaks_app:app"]
