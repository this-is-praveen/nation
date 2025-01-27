from fastapi import APIRouter, HTTPException
from api.models.schemas import SearchByTextRequest, QueryRequest
from api.services.mongo import search_embeddings, get_document_by_id
from api.services.clip import generate_text_embedding, cosine_similarity
from api.constants.labelInfo import PREDEFINED_LABELS
import numpy as np

router = APIRouter()

@router.post("/search", tags=["Search"])
async def search_embeddings_endpoint(request: QueryRequest):
    try:
        results = search_embeddings(request.query_embedding, request.limit)
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/search-by-text", tags=["Search"])
async def search_by_text(request: SearchByTextRequest):
    """
    Accepts a query text, generates its embedding, and performs a search.
    """
    try:
        # Step 1: Generate the text embedding
        query_embedding = generate_text_embedding(request.query_text)
        
        # Step 2: Use the generated embedding to perform the search
        results = search_embeddings(query_embedding=query_embedding, limit=request.limit)

        for result in results:
            if "_id" in result:
                result["_id"] = str(result["_id"])
                
        # Return the search results
        return {"query_text": request.query_text, "results": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during search: {str(e)}")
    
@router.post("/get-meta-info")
async def get_meta_info(id: str):
    """
    Fetch the embedding by document ID and return meta-information based on predefined labels.
    """
    try:
        # Fetch the document from the database
        document = get_document_by_id(id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        # Get the image embedding
        embedding = document.get("mediaDetails", {}).get("imageEmbeddings")
        if not embedding:
            raise HTTPException(status_code=404, detail="Image embedding not found in the document")

        # Convert embedding to NumPy array
        image_embedding = np.array(embedding)

        # Generate embeddings for predefined labels
        label_embeddings = [generate_text_embedding(label) for label in PREDEFINED_LABELS]

        # Compute similarity scores
        similarities = [
            {
                "label": label,
                "similarity": cosine_similarity(image_embedding, np.array(label_embedding))
            }
            for label, label_embedding in zip(PREDEFINED_LABELS, label_embeddings)
        ]

        # Sort labels by similarity (highest first)
        similarities = sorted(similarities, key=lambda x: x["similarity"], reverse=True)

        # Return the top 5 matches
        return {"meta_info": similarities[:5]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e.detail)}")