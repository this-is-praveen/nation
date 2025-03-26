from pymongo import MongoClient
from transformers import CLIPProcessor, CLIPModel
import logging
from dotenv import load_dotenv
import os

load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(message)s")
logger = logging.getLogger(__name__)

def display_banner():
    banner = r"""

    
    MongoDB and CLIP Service Initializer                        
    """
    print(banner)

# Display banner
display_banner()

# Load CLIP model and processor
try:
    logger.info("Loading CLIP model...")
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    tokenizer = processor.tokenizer
    logger.info("CLIP model loaded successfully!")
except Exception as e:
    logger.error(f"Failed to load CLIP model: {e}")
    raise

# Initialize MongoDB connection
try:
    logger.info("Connecting to MongoDB...")
    uri = os.getenv("MONGO_URI")
    database_name = os.getenv("DATABASE_NAME")
    collection_name = os.getenv("COLLECTION_NAME")

    client = MongoClient(uri)
    db = client[database_name]
    collection = db[collection_name]
    secondary_collection = db["instructions"]
    # Test connection
    client.admin.command('ping')
    logger.info(f"Connected to MongoDB database: {database_name}, collection: {collection_name}")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {e}")
    raise
