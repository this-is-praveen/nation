from api.core.serviceInit import model, processor, tokenizer
from PIL import Image
import torch
import io
import numpy as np

def generate_image_embedding(image_data: bytes):
    image = Image.open(io.BytesIO(image_data)).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        embeddings = model.get_image_features(**inputs)
    return embeddings.squeeze().tolist()

def generate_text_embedding(text: str):
    inputs = tokenizer([text], return_tensors="pt")
    with torch.no_grad():
        text_embeddings = model.get_text_features(**inputs)
    return text_embeddings.squeeze().tolist()

def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """
    Calculate the cosine similarity between two vectors.
    """
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    if norm1 == 0 or norm2 == 0:
        return 0.0  # Avoid division by zero
    return np.dot(vec1, vec2) / (norm1 * norm2)
