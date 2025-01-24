from fastapi import FastAPI, Form, File, HTTPException, UploadFile
from pydantic import BaseModel, HttpUrl
from typing import List
import numpy as np
import requests

app = FastAPI()

# Load CLIP model and processor
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
import io

print("Loading CLIP model...")
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
tokenizer = processor.tokenizer
print("CLIP model loaded successfully!")

# Input schema for insights and querying
class EmbeddingInput(BaseModel):
    embedding_list: List[float]

class EmbeddingQuery(BaseModel):
    embedding_list: List[float]
    query_embedding: List[float]
    

# Endpoint: Generate embeddings (already existing)
@app.post("/generate-embeddings")
async def generate_embeddings(file: UploadFile = File(...)):
    """
    Accepts an image file and returns its embeddings.
    """
    try:
        # Read the uploaded image file
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data)).convert("RGB")

        # Preprocess the image and generate embeddings
        inputs = processor(images=image, return_tensors="pt")
        with torch.no_grad():
            embeddings = model.get_image_features(**inputs)

        # Convert embeddings to a list and return as JSON
        embedding_list = embeddings.squeeze().tolist()
        return {"embeddings": embedding_list}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embeddings: {str(e)}")

class ImageUrlInput(BaseModel):
    url: HttpUrl

@app.post("/generate-embeddings-from-url")
async def generate_embeddings_from_url(image_url: ImageUrlInput):
    """
    Accepts an image URL and returns its embeddings.
    """
    try:
        # Download the image from the URL
        response = requests.get(str(image_url.url))
        response.raise_for_status()  # Raise an exception for bad status codes
        
        # Open the image from bytes
        image = Image.open(io.BytesIO(response.content)).convert("RGB")

        # Preprocess the image and generate embeddings
        inputs = processor(images=image, return_tensors="pt")
        with torch.no_grad():
            embeddings = model.get_image_features(**inputs)

        # Convert embeddings to a list and return as JSON
        embedding_list = embeddings.squeeze().tolist()
        return {"embeddings": embedding_list}

    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Error downloading image: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embeddings: {str(e)}")

# Endpoint 1: Insights API
@app.post("/insights")
async def get_insights(payload: EmbeddingInput):
    """
    Analyze the embedding list and return insights.
    """
    embedding = np.array(payload.embedding_list)
    norm = np.linalg.norm(embedding)
    dimensions = embedding.shape[0]
    mean_value = np.mean(embedding)
    std_deviation = np.std(embedding)

    return {
        "insights": {
            "dimensions": dimensions,
            "norm": norm,
            "mean_value": mean_value,
            "std_deviation": std_deviation,
        }
    }


# Endpoint 2: Query API
@app.post("/query")
async def query_embedding(payload: EmbeddingQuery):
    """
    Compare the query embedding with a given embedding list.
    """
    embedding = np.array(payload.embedding_list)
    query_embedding = np.array(payload.query_embedding)

    if embedding.shape != query_embedding.shape:
        raise HTTPException(status_code=400, detail="Embeddings must have the same dimensions.")

    similarity = cosine_similarity(embedding, query_embedding)

    return {
        "query_result": {
            "similarity_score": similarity,
            "is_similar": similarity > 0.8  # Arbitrary threshold for "similar"
        }
    }


@app.post("/generate-query-embedding")
async def generate_query_embedding(
    query_text: str = Form(None),
):
    """
    Accepts text generates embeddings, and returns them.
    """
    try:
        # Generate embeddings for text
        inputs = tokenizer([query_text], return_tensors="pt")
        with torch.no_grad():
            text_embeddings = model.get_text_features(**inputs)
        embedding_list = text_embeddings.squeeze().tolist()
        return {"embeddings": embedding_list}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embedding: {str(e)}")

# Cosine Similarity Helper Function
def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """
    Calculate the cosine similarity between two vectors.
    """
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    if norm1 == 0 or norm2 == 0:
        return 0.0  # Avoid division by zero
    return np.dot(vec1, vec2) / (norm1 * norm2)


@app.get("/")
async def root():
    """
    Health check endpoint.
    """
    return {"message": "CLIP Embedding Service is running!"}
