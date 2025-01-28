# CLIP Embedding Service

This project provides a FastAPI-based service for generating embeddings using the CLIP model from OpenAI.

## Features
- Accepts image uploads to generate embeddings.
- Provides health check and API endpoints.

## Setup Instructions

### Prerequisites
- Python 3.9+
- Pip (Python Package Installer)

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/clip-service.git
   cd clip-service


# To run application
$env:ENV = "local"; python main.py
uvicorn clip_service:app --host 0.0.0.0 --port 5000

# Test the API by
curl -X POST "http://localhost:5000/generate-embeddings" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@path/to/your/image.jpg"

# To run docker File
docker build -t clip-service .
docker run -p 5000:5000 clip-service
