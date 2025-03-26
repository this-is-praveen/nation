from fastapi import APIRouter, HTTPException, Query, status
from bson import ObjectId
from typing import List, Dict, Optional
from pydantic import BaseModel
from core.serviceInit import secondary_collection

instructions_collection = secondary_collection
router = APIRouter()

# Pydantic model for instruction creation
class InstructionCreate(BaseModel):
    technology: str
    instruction: str
    strict_rules: List[str]

# API 1: List all instruction IDs
@router.get("/instructions/ids", response_model=List[str])
async def list_instruction_ids():
    """
    Return a list of all instruction document IDs in the collection.
    """
    try:
        return [str(doc["_id"]) for doc in instructions_collection.find({}, {"_id": 1})]
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error fetching instruction IDs: {str(e)}"
        )

# API 2: Get full instruction by ID
@router.get("/instructions/{id}", response_model=Dict)
async def get_instruction(
    id: str,
):
    """
    Fetch and return an instruction document by its ID.
    """
    try:
        object_id = ObjectId(id)
        document = instructions_collection.find_one({"_id": object_id})
        
        if not document:
            raise HTTPException(status_code=404, detail="Instruction not found")
        
        document["_id"] = str(document["_id"])
        return document
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error fetching instruction: {str(e)}"
        )

# API 3: Paginated list of instructions
@router.get("/instructions", tags=["Instructions"])
async def list_instructions(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    technology: Optional[str] = Query(None, description="Filter by technology")
):
    """
    Fetch paginated list of instructions with basic info.
    """
    try:
        skip = (page - 1) * page_size
        query_filter = {}
        if technology:
            query_filter["technology"] = {"$regex": technology, "$options": "i"}

        cursor = instructions_collection.find(
            query_filter, 
            {"_id": 1, "technology": 1, "instruction": 1,"strict_rules": 1}
        ).skip(skip).limit(page_size)

        instructions = [{
            "id": str(doc["_id"]),
            "technology": doc["technology"],
            "strictRules": doc["strict_rules"],
            "summary": doc["instruction"][:100] + "..." if len(doc["instruction"]) > 100 else doc["instruction"]
        } for doc in cursor]

        total_count = instructions_collection.count_documents(query_filter)

        return {
            "page": page,
            "page_size": page_size,
            "total_instructions": total_count,
            "total_pages": (total_count + page_size - 1) // page_size,
            "instructions": instructions,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error fetching instructions: {str(e)}"
        )

# API 4: Create new instruction
@router.post(
    "/instructions",
    status_code=status.HTTP_201_CREATED,
    summary="Create a new instruction template"
)
async def create_instruction(instruction: InstructionCreate):
    """
    Insert a new instruction document with:
    - technology: The tech stack (e.g., "React", ".NET Core")
    - instruction: Detailed task description
    - strict_rules: List of mandatory rules
    """
    try:
        result = instructions_collection.insert_one(instruction.dict())
        return {
            "id": str(result.inserted_id),
            "status": "success",
            "message": "Instruction created successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Instruction creation failed: {str(e)}"
        )

# API 5: Search instructions by content
@router.get("/instructions/search", tags=["Instructions"])
async def search_instructions(
    query: str = Query(..., min_length=2),
    limit: int = Query(5, ge=1, le=20)
):
    """
    Full-text search across instruction content.
    """
    try:
        # Create text index if it doesn't exist
        if "instruction_text" not in instructions_collection.index_information():
            instructions_collection.create_index([
                ("technology", "text"),
                ("instruction", "text"),
                ("strict_rules", "text")
            ], name="instruction_text")

        cursor = instructions_collection.find(
            {"$text": {"$search": query}},
            {"score": {"$meta": "textScore"}}
        ).sort([("score", {"$meta": "textScore"})]
        ).limit(limit)

        results = [{
            "id": str(doc["_id"]),
            "technology": doc["technology"],
            "score": doc["score"],
            "match": doc["instruction"][:150] + "..." if len(doc["instruction"]) > 150 else doc["instruction"]
        } for doc in cursor]

        return {"query": query, "results": results}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Search failed: {str(e)}"
        )