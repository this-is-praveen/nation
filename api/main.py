from fastapi import FastAPI
from core.serviceInit import client, db, collection, model, processor, tokenizer

from core.config import settings
from endpoints.clip import router as clip_router
from endpoints.search import router as search_router
from endpoints.info import router as info_router
from endpoints.mongoInfo import router as mongoInfo_router

# Initialize the FastAPI app
app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

# Include routers
app.include_router(clip_router, prefix="", tags=["CLIP"])
app.include_router(search_router, prefix="", tags=["Search"])
app.include_router(info_router, prefix="", tags=["Info"])
app.include_router(mongoInfo_router, prefix="", tags=["MongoData"])

# For running with Uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
