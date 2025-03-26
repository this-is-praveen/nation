from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, Field
from typing import List, Optional
from bson import ObjectId
import openai
import os
from core.serviceInit import secondary_collection

instructions_collection = secondary_collection

router = APIRouter()

class AIRequest(BaseModel):
    user_prompt: str = Field(..., description="The user's main question or task")
    instruction_id: Optional[str] = Field(
        None,
        description="ID of a predefined instruction from MongoDB (exclusive with instructions/strict_rules)"
    )
    instructions: Optional[List[str]] = Field(
        None, 
        description="List of guiding instructions (only used when instruction_id is not provided)"
    )
    strict_rules: Optional[List[str]] = Field(
        None,
        description="List of rules (only used when instruction_id is not provided)"
    )
    model: str = Field("gpt-4", description="OpenAI model to use")
    temperature: float = Field(0.7, ge=0, le=1, description="Controls randomness")

async def get_instruction_data(instruction_id: str) -> dict:
    """Fetch instruction and its strict_rules from MongoDB"""
    try:
        document = instructions_collection.find_one({"_id": ObjectId(instruction_id)})
        if not document:
            raise HTTPException(status_code=404, detail="Instruction not found")
        return {
            "instruction": document["instruction"],
            "strict_rules": document.get("strict_rules", [])
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid instruction ID: {str(e)}"
        )

@router.post("/ai/completions")
async def get_ai_completion(request: AIRequest):
    """
    Generates AI response with:
    - Either predefined instruction (via instruction_id) + its strict_rules
    - Or ad-hoc instructions + rules
    """
    try:
        # Validate mutually exclusive parameters
        if request.instruction_id and (request.instructions or request.strict_rules):
            raise HTTPException(
                status_code=400,
                detail="Cannot provide both instruction_id and instructions/strict_rules"
            )

        # Get instructions and rules
        if request.instruction_id:
            # Get everything from the database
            instruction_data = await get_instruction_data(request.instruction_id)
            instructions = [instruction_data["instruction"]]
            strict_rules = instruction_data["strict_rules"]
        else:
            # Use provided values (default to empty lists if None)
            instructions = request.instructions or []
            strict_rules = request.strict_rules or []

        # Build system message
        system_message_parts = ["You are an expert AI assistant that strictly follows rules."]
        
        if instructions:
            system_message_parts.append("\nINSTRUCTIONS:")
            system_message_parts.extend(f"- {i}" for i in instructions)
            
        if strict_rules:
            system_message_parts.append("\nSTRICT RULES (MUST FOLLOW):")
            system_message_parts.extend(f"- {r}" for r in strict_rules)

        system_message = "\n".join(system_message_parts)

        # Call OpenAI
        client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        response = client.chat.completions.create(
            model=request.model,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": request.user_prompt}
            ],
            temperature=request.temperature,
            max_tokens=2000
        )

        return {
            "response": response.choices[0].message.content,
            "metadata": {
                "used_instruction_id": request.instruction_id,
                "applied_instructions": instructions,
                "applied_rules": strict_rules
            },
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens
            }
        }
        
    except HTTPException:
        raise
    except openai.APIError as e:
        raise HTTPException(502, f"OpenAI API error: {str(e)}")
    except Exception as e:
        raise HTTPException(500, f"Internal error: {str(e)}")