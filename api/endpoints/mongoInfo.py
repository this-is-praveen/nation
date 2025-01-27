from fastapi import APIRouter, HTTPException
from bson import ObjectId
from typing import List, Dict
from api.services.mongo import collection


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
async def get_document(id: str):
    """
    Fetch and return the document by its ID.
    """
    try:
        # Convert string ID to ObjectId
        object_id = ObjectId(id)
        
        # Retrieve the document by ID
        document = collection.find_one({"_id": object_id})
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Convert document ID to string for readability
        document["_id"] = str(document["_id"])
        
        return document
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching document: {str(e)}")
