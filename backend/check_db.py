import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient

async def main():
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(mongo_uri)
    db = client.truthscan_db
    count = await db.analyses.count_documents({})
    print(f"REAL_TOTAL_COUNT:{count}")

if __name__ == "__main__":
    asyncio.run(main())
