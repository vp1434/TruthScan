from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend

def setup_cache():
    # Use InMemory for simplicity. Can be swapped for RedisBackend later
    FastAPICache.init(InMemoryBackend(), prefix="fastapi-cache")
