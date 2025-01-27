from pydantic import BaseModel, HttpUrl
from typing import List

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