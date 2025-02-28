from pymongo import MongoClient
from model.config import DB_URI

# Connect to MongoDB
client = MongoClient(DB_URI)
db = client["MailData"]  # Ensure database selection

def save_to_mongodb(collection_name, data):
    """Save data to MongoDB in a given collection."""
    try:
        collection = db[collection_name]  # Get collection
        result = collection.insert_one(data)  # Insert data
        return True, f"Data saved successfully with ID: {result.inserted_id}"
    except Exception as e:
        return False, f"Error saving data: {str(e)}"
