from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from services.clip import generate_image_embedding, generate_text_embedding
from models.schemas import ImageUrlInput
import requests

router = APIRouter()

@router.post("/generate-embeddings")
async def generate_embeddings(file: UploadFile = File(...)):
    try:
        image_data = await file.read()
        embedding_list = generate_image_embedding(image_data)
        return {"embeddings": embedding_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embeddings: {str(e)}")

@router.post("/generate-embeddings-from-url")
async def generate_embeddings_from_url(image_url: ImageUrlInput):
    try:
        response = requests.get(str(image_url.url), timeout=10)
        response.raise_for_status()
        embedding_list = generate_image_embedding(response.content)
        return {"embeddings": embedding_list}
    except requests.RequestException as e:
        raise HTTPException(status_code=400, detail=f"Error downloading image: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embeddings: {str(e)}")

@router.post("/generate-query-embedding")
async def generate_query_embedding(query_text: str = Form(...)):
    try:
        embedding_list = generate_text_embedding(query_text)
        return {"embeddings": embedding_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating embedding: {str(e)}")
