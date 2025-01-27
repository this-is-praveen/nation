from pydantic import BaseModel, HttpUrl
from typing import List
from api.constants.labelInfo import PREDEFINED_LABELS
from dotenv import load_dotenv
import os

load_dotenv()

class EmbeddingInput(BaseModel):
    embedding_list: List[float]

class EmbeddingQuery(BaseModel):
    embedding_list: List[float]
    query_embedding: List[float]

class ImageUrlInput(BaseModel):
    """
    Schema for validating image URL input.
    """
    url: HttpUrl

class QueryRequest(BaseModel):
    """
    Schema for validating a query embedding request for searching similar items.
    """
    query_embedding: List[float]
    limit: int = 5

class SearchByTextRequest(BaseModel):
    query_text: str
    limit: int = 5
    
class DocumentIdRequest(BaseModel):
    id: str


ENV_LABELS = os.getenv("DEFAULT_LABELS")
DEFAULT_LABELS = ENV_LABELS.split(",") if ENV_LABELS else PREDEFINED_LABELS

class MetaInfoRequest(BaseModel):
    id: str
    labels: List[str] = DEFAULT_LABELS