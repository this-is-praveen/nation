from fastapi import APIRouter, HTTPException, Query, status
from bson import ObjectId
from typing import List, Dict, Optional
from services.mongo import collection

router = APIRouter()

# API 1: List of document IDs
@router.get("/list-ids", response_model=List[str])
async def list_ids():
    """
    Return a list of all document IDs in the collection.
    """
    try:
        # Retrieve document IDs
        document_ids = [str(doc["_id"]) for doc in collection.find({}, {"_id": 1})]
        return document_ids
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching document IDs: {str(e)}")

# API 2: Get document info by ID
@router.get("/get-document/{id}", response_model=Dict)
async def get_document(
    id: str,
    include_embeddings: bool = Query(False, description="Set to true to include mediaDetails.imageEmbeddings in the response"),
):
    """
    Fetch and return the document by its ID.
    By default, `mediaDetails.imageEmbeddings` is excluded from the response. 
    Use the `include_embeddings` query parameter to include it.
    """
    try:
        # Convert string ID to ObjectId
        object_id = ObjectId(id)
        
        # Define projection to exclude `mediaDetails.imageEmbeddings` by default
        projection = {"mediaDetails.imageEmbeddings": 0} if not include_embeddings else {}
        
        # Retrieve the document by ID with the specified projection
        document = collection.find_one({"_id": object_id}, projection)
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Convert document ID to string for readability
        document["_id"] = str(document["_id"])
        
        return document
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching document: {str(e)}")

@router.get("/list-documents", tags=["MongoData"])
async def list_documents(
    page: int = Query(1, ge=1, description="Page number (1-based)"),
    page_size: int = Query(10, ge=1, le=100, description="Number of documents per page (max 100)"),
    name: Optional[str] = Query(None, description="Filter documents by name (partial match supported)"),
):
    """
    Fetch paginated list of documents containing only `id` and `name` fields.
    """
    try:
        skip = (page - 1) * page_size
        query_filter = {}
        if name:
            # Add case-insensitive partial match for `name`
            query_filter["name"] = {"$regex": name, "$options": "i"}

        cursor = collection.find(query_filter, {"_id": 1, "name": 1}).skip(skip).limit(page_size)

        documents = [{"id": str(doc["_id"]), "name": doc.get("name", None)} for doc in cursor]

        total_count = collection.count_documents(query_filter)

        return {
            "page": page,
            "page_size": page_size,
            "total_documents": total_count,
            "total_pages": (total_count + page_size - 1) // page_size,
            "documents": documents,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching documents: {str(e)}")
    
@router.post("/insert-document", 
            status_code=status.HTTP_201_CREATED,
            summary="Insert new document with name and image URL")
async def insert_document(
    name: str = Query(..., min_length=1, max_length=100),
    image_url: str = Query(..., regex=r"^https?://")
):
    """
    Insert a new document with basic metadata:
    - **name**: Display name for the document (1-100 characters)
    - **image_url**: Valid HTTP/HTTPS URL for the image
    """
    try:
        document = {
            "name": name.strip(),
            "mediaDetails": {
                "imageUrl": image_url.strip()
            }        
        }

        result = collection.insert_one(document)
        
        return {
            "id": str(result.inserted_id),
            "status": "success",
            "message": "Document inserted successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Document insertion failed: {str(e)}"
        )