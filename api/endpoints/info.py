from fastapi import APIRouter, HTTPException
from bson import ObjectId
import numpy as np
from api.models.schemas import DocumentIdRequest
from api.services.mongo import get_document_by_id

router = APIRouter()

@router.post("/get-embedding-info", tags=["Info"])
async def get_embedding_info(request: DocumentIdRequest):
    """
    Fetch the image embedding by document ID and return insights.
    """
    try:
        # Convert the string ID to ObjectId
        object_id = ObjectId(request.id)

        # Fetch the document from MongoDB
        document = get_document_by_id(object_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        # Retrieve the imageEmbedding
        embedding = document.get("mediaDetails", {}).get("imageEmbeddings")
        if not embedding:
            raise HTTPException(status_code=404, detail="Image embedding not found in the document")

        # Convert embedding to a NumPy array
        embedding_array = np.array(embedding)

        # Calculate insights
        dimensions = embedding_array.shape[0]
        norm = np.linalg.norm(embedding_array)
        mean_value = np.mean(embedding_array)
        std_deviation = np.std(embedding_array)
        max_value = np.max(embedding_array)

        return {
            "dimensions": dimensions,
            "norm": norm,
            "mean_value": mean_value,
            "std_deviation": std_deviation,
            "max_value": max_value,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
