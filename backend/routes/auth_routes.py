from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
import bcrypt
from jose import JWTError, jwt
from datetime import datetime, timedelta
from utils.db import get_db
from utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/auth")

SECRET_KEY = "truthscan-secret-2024-change-in-prod"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


def hash_password(plain: str) -> str:
    """Hash a plain-text password using bcrypt directly."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    """Verify a plain-text password against a bcrypt hash."""
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_token(user_id: str, email: str, name: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": user_id, "email": email, "name": name, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register")
async def register(req: RegisterRequest):
    db = get_db()
    existing = await db.users.find_one({"email": req.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(req.password)
    result = await db.users.insert_one({
        "name": req.name,
        "email": req.email,
        "password": hashed,
        "created_at": datetime.utcnow().isoformat()
    })
    user_id = str(result.inserted_id)
    token = create_token(user_id, req.email, req.name)
    logger.info(f"New user registered: {req.email}")
    return {"access_token": token, "user_id": user_id, "name": req.name, "email": req.email}


@router.post("/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    db = get_db()
    user = await db.users.find_one({"email": form.username})
    if not user or not verify_password(form.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_id = str(user["_id"])
    token = create_token(user_id, user["email"], user["name"])
    logger.info(f"User logged in: {user['email']}")
    return {"access_token": token, "user_id": user_id, "name": user["name"], "email": user["email"]}


@router.get("/me")
async def me():
    """Protected route placeholder — validate token on frontend"""
    return {"message": "ok"}
