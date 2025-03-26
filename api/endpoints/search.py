from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel, Field
from typing import List, Optional
import openai
import os

router = APIRouter()

# Request Model
class AIRequest(BaseModel):
    user_prompt: str = Field(..., description="The user's main question or task")
    instructions: Optional[List[str]] = Field(
        None, 
        description="List of guiding instructions for the AI"
    )
    strict_rules: Optional[List[str]] = Field(
        None,
        description="List of non-negotiable rules the AI must follow"
    )
    model: str = Field(
        "gpt-4", 
        description="OpenAI model to use (e.g., gpt-4, gpt-3.5-turbo)"
    )
    temperature: float = Field(
        0.7, 
        ge=0, 
        le=1, 
        description="Controls randomness (0=deterministic, 1=creative)"
    )

@router.post("/ai/completions", summary="Get AI completion with instructions")
async def get_ai_completion(request: AIRequest):
    """
    Generates AI response with strict adherence to provided instructions and rules.
    
    The system message will contain the rules/instructions, while the user message 
    contains the prompt. This ensures clear separation of concerns in the chat context.
    """
    try:
        # Build system message with instructions and rules
        system_message_parts = []
        
        if request.instructions:
            system_message_parts.append("INSTRUCTIONS:")
            system_message_parts.extend([f"- {i}" for i in request.instructions])
            
        if request.strict_rules:
            system_message_parts.append("\nSTRICT RULES (MUST FOLLOW):")
            system_message_parts.extend([f"- {r}" for r in request.strict_rules])
        
        system_message = "\n".join(system_message_parts) if system_message_parts else (
            "You are a helpful AI assistant that provides accurate and concise responses."
        )

        client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        response = client.chat.completions.create(
            model=request.model,
            messages=[
                {
                    "role": "system",
                    "content": system_message
                },
                {
                    "role": "user",
                    "content": request.user_prompt
                }
            ],
            temperature=request.temperature,
            max_tokens=2000
        )

        return {
            "response": response.choices[0].message.content,
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens
            }
        }
        
    except openai.APIError as e:
        raise HTTPException(
            status_code=502,
            detail=f"OpenAI API error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )