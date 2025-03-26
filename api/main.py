from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.serviceInit import client, db, collection, model, processor, tokenizer

from core.config import settings
from endpoints.clip import router as clip_router
from endpoints.search import router as search_router
from endpoints.info import router as info_router
from endpoints.mongoInfo import router as mongoInfo_router
from endpoints.ai_router import router as ai_router
from endpoints.instructions import router as instructions_router

# Initialize the FastAPI app
app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Include routers
app.include_router(ai_router, prefix="", tags=["Open AI"])
app.include_router(clip_router, prefix="", tags=["CLIP"])
# app.include_router(search_router, prefix="", tags=["Search"])
app.include_router(info_router, prefix="", tags=["Info"])
app.include_router(mongoInfo_router, prefix="", tags=["MongoData"])
app.include_router(instructions_router, prefix="", tags=["Instructions"])

# Add "/" endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint to provide basic API information.
    """
    return {"message": "Welcome to the API!", "project_name": settings.PROJECT_NAME, "version": settings.VERSION}

# Add "/healthz" endpoint
@app.get("/healthz", tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify the API is running and connected to MongoDB.
    """
    try:
        # Test MongoDB connection
        client.admin.command("ping")
        return {"status": "ok", "message": "Service is healthy!"}
    except Exception as e:
        return {"status": "error", "message": f"Service unhealthy: {str(e)}"}

# For running with Uvicorn
if __name__ == "__main__":
    import os
    import uvicorn
    
    reload = os.environ.get("ENV") == "local"

    uvicorn.run(app, host="0.0.0.0", port=5000, reload=True)
