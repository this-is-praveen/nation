from api.core.serviceInit import collection
from bson import ObjectId

def search_embeddings(query_embedding: list, limit: int = 5):
    pipeline = [
        {
            '$vectorSearch': {
                'queryVector': query_embedding, 
                'path': 'mediaDetails.imageEmbeddings', 
                'numCandidates': 512, 
                'index': 'vector_imageEmbedding', 
                'limit': limit
            }
        }
    ]
    results = list(collection.aggregate(pipeline))
    return results

def get_document_by_id(doc_id: str):
    """
    Fetch a document from MongoDB by its ID.
    """
    try:
        object_id = ObjectId(doc_id)
        return collection.find_one({"_id": object_id})
    except Exception as e:
        raise ValueError(f"Invalid ID format or error fetching document: {str(e)}")