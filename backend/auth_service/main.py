from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt  # Ensure you are using PyJWT
import os

# FastAPI instance
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

SECRET_KEY = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

fake_users_db = {
    "user@example.com": {
        "username": "user@example.com",
        "hashed_password": "$2b$12$SigZ2aCT/Wyeg8rlxZiJDee08BunWJle.D3uyS2fOh/KxVXLeE7ei"  # Hashed password for "password"
    }
}

# Pydantic model for the user login response (token)
class Token(BaseModel):
    access_token: str
    token_type: str

# Pydantic model for user data (to simulate registration, login)
class User(BaseModel):
    username: str
    email: str

class UserInDB(User):
    hashed_password: str

# Function to verify the user's password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Function to hash the password
def get_password_hash(password: str):
    return pwd_context.hash(password)

# Function to get user from the database
def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        # Ensure both email and hashed_password are included in the user_dict
        user_dict["email"] = username  # Assuming the username is the email
        return UserInDB(**user_dict)
    return None

# Function to create an access token
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)  # Use jwt.encode() directly
    return encoded_jwt

# Login endpoint to authenticate and return a JWT token
@app.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    print(f"Login request received: {form_data.username} {form_data.password}")  # Log to check received data
    
    user = get_user(fake_users_db, form_data.username)
    
    if user is None:
        raise HTTPException(
            status_code=401, 
            detail="User not found"
        )

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401, 
            detail="Invalid credentials"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Protected route example that requires authentication
@app.get("/protected")
async def read_protected(token: str = Depends(oauth2_scheme)):
    try:
        # Decode the token and validate it
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        
        # If the username is missing, it's an invalid token
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # If everything is fine, return the protected content
    return {"message": "You have access to this protected route!", "username": username}

# Example of how to generate a password hash
@app.get("/generate-hash")
async def generate_hash(password: str):
    return {"password_hash": get_password_hash(password)}
