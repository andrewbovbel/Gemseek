from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Header
from fastapi.responses import Response, JSONResponse
from sqlalchemy import create_engine, Column, String, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from jwt import ExpiredSignatureError, InvalidTokenError
import jwt
import os
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
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
# ✅ PostgreSQL Database Connection
DATABASE_URL = "postgresql://postgres:CaviarSushi33@localhost:5432/photos"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ✅ JWT Secret (Must match Account Service)
JWT_SECRET = "sushi"
JWT_ALGORITHM = "HS256"

# ✅ Image Database Model with Composite Primary Key
class Image(Base):
    __tablename__ = "images"
    email = Column(String, primary_key=True)  # ✅ Part of Composite PK
    filename = Column(String, primary_key=True)  # ✅ Part of Composite PK
    data = Column(LargeBinary, nullable=False)  # ✅ Stores image as BLOB

Base.metadata.create_all(bind=engine)

# ✅ Dependency: Get Database Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ✅ Function to verify JWT token and decode email
def verify_jwt(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization token missing or invalid")

    token = authorization.split("Bearer ")[1]

    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_token
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ✅ Image Upload Endpoint (Saves Image in PostgreSQL as BLOB)
@app.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    token_data: dict = Depends(verify_jwt),
    db: Session = Depends(get_db)
):
    email = token_data["email"]  # ✅ Get user email from token
    image_data = await file.read()  # ✅ Read file as binary

    # ✅ Check if file already exists
    existing_image = db.query(Image).filter(Image.email == email, Image.filename == file.filename).first()
    if existing_image:
        raise HTTPException(status_code=400, detail="File with this name already exists")

    # ✅ Insert new image
    new_image = Image(email=email, filename=file.filename, data=image_data)
    db.add(new_image)
    db.commit()

    return {"message": "Image uploaded successfully", "filename": file.filename, "user": email}

# ✅ Retrieve an Image by Filename
@app.get("/image/{filename}")
def get_image(filename: str, token_data: dict = Depends(verify_jwt), db: Session = Depends(get_db)):
    email = token_data["email"]
    image = db.query(Image).filter(Image.email == email, Image.filename == filename).first()

    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    return Response(content=image.data, media_type="image/jpeg")  # ✅ Return image as binary response

# ✅ Get List of User's Uploaded Images
@app.get("/images")
def get_user_images(token_data: dict = Depends(verify_jwt), db: Session = Depends(get_db)):
    email = token_data["email"]
    user_images = db.query(Image).filter(Image.email == email).all()

    if not user_images:
        return {"message": "No images found for this user"}

    return {"images": [{"filename": image.filename} for image in user_images]}