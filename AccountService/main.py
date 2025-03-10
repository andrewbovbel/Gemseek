from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm, HTTPBearer
from pydantic import BaseModel
from jwtsign import sign, decode
import bcrypt
from sqlalchemy import create_engine, Column, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

from fastapi.middleware.cors import CORSMiddleware
# Database Connection (Replace with Cloud SQL URL for GCP)

import logging

logging.basicConfig(level=logging.DEBUG)

DATABASE_URL = "postgresql://postgres:CaviarSushi33@localhost:5432/your_db"
# DATABASE_URL = "postgresql://postgres:CaviarSushi33@34.28.42.153:5432/gemseek"
engine = create_engine(DATABASE_URL)
security = HTTPBearer()  # 👈 Adds Bearer Token input to Swagger UI
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# User Model
class User(Base):
    __tablename__ = "users"
    email = Column(String, primary_key=True)
    name = Column(String)
    password = Column(String)

Base.metadata.create_all(bind=engine)



class SignUpSchema(BaseModel):
    name: str
    email: str 
    password: str 


# Define a secret API key (store in an environment variable for security)
SECRET_API_KEY = "sushi"

# Middleware to check API key
def verify_api_key(request: Request):
    api_key = request.headers.get("X-API-Key")
    if api_key != SECRET_API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")

app = FastAPI(dependencies=[Depends(verify_api_key)])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="signin")
# ✅ Define allowed frontend URLs
origins = [
    "http://localhost:8001",
    "http://localhost:3000",  # ✅ Expo app (adjust to your port)
    "http://127.0.0.1:8001",  # ✅ Alternative localhost version
    "http://localhost:19006", # ✅ Expo development URL
    "http://127.0.0.1:19006", # ✅ Alternative Expo URL
    "https://fastapi-app-427504069028.us-central1.run.app"  # ✅ Production backend
]

# ✅ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # ✅ Allow specific frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # ✅ Explicitly allow OPTIONS & POST
     # ✅ Allow all methods (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],     # ✅ Allow all headers, including "X-API-Key"
)

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode(), salt)
    return hashed.decode()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode(), hashed_password.encode())

# Dependency: Get DB Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/signup")
def signup(request: SignUpSchema, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(request.password)
    new_user = User(name=request.name, email=request.email, password=hashed_password)
    db.add(new_user)  # ✅ Correct: Adding a SQLAlchemy model instance
    db.commit()
    db.commit()
    token = sign(request.email)
    
    return {"message": "User registered successfully", "token": token}


@app.post("/signin")
def signin(request: SignUpSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(status_code=400, detail="Incorrect password")
    token = sign(user.email)
    return {
        "message": "Login successful",
        "token": token,
        "user": {"email": user.email, "name": user.name},  # ✅ Add user details
    }


# JWT Authentication Middleware
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    decoded = decode(token)
    email = decoded.get("email")

    if not email:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

@app.get("/protected")
def protected_route(current_user: User = Depends(get_current_user)):
    return {"message": "You are authenticated!", "user": current_user.email}

@app.delete("/delete-account")
def delete_account(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == current_user.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": "Account deleted successfully"}

@app.post("/verify-token")
def verify_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    print(token)
    decoded = decode(token)
    email = decoded.get("email")

    if not email:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return {"email": user.email}  # ✅ Only return email (minimal response)