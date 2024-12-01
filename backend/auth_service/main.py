from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
import os

# FastAPI instance
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Security setup
SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Mock database
fake_users_db = {
    "user@example.com": {
        "username": "user@example.com",
        "hashed_password": "$2b$12$SigZ2aCT/Wyeg8rlxZiJDee08BunWJle.D3uyS2fOh/KxVXLeE7ei"  # Hashed password for "password"
    }
}

# Pydantic models
class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    username: str
    email: str

class UserInDB(User):
    hashed_password: str

# Helper functions
def verify_password(plain_password, hashed_password):
    """Verify plain password against hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str):
    """Hash a plain text password."""
    return pwd_context.hash(password)

def get_user(db, username: str):
    """Retrieve user from the mock database."""
    if username in db:
        user_dict = db[username]
        user_dict["email"] = username
        return UserInDB(**user_dict)
    return None

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    """Generate a JWT token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Routes
@app.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login endpoint for user authentication."""
    user = get_user(fake_users_db, form_data.username)
    if user is None or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/menu")
async def get_menu(token: str = Depends(oauth2_scheme)):
    """Protected route: Returns menu data for authenticated users."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"menu": "Welcome to your protected menu, authenticated user!"}
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/protected")
async def read_protected(token: str = Depends(oauth2_scheme)):
    """Another example of a protected route."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"message": "Access granted!", "username": username}
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/generate-hash")
async def generate_hash(password: str):
    """Utility to generate a hashed password."""
    return {"password_hash": get_password_hash(password)}
