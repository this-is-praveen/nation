from fastapi import FastAPI, File, UploadFile, HTTPException
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import torch
import io

# Initialize FastAPI
app = FastAPI()

# Load CLIP model and processor
print("Loading CLIP model...")
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
print("CLIP model loaded successfully!")

@app.post("/generate-embeddings")
async def generate_embeddings(file: UploadFile = File(...)):
    """
    Accepts an image file and returns its embeddings.
    """
    try:
        # Read image file
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


@app.get("/")
async def root():
    return {"message": "CLIP Embedding Service is running!"}
