from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from auth import verify_jwt
from typing import List
from fastapi.responses import JSONResponse, Response

router = APIRouter()
from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from models import GemstonePhoto
from database import get_db
from auth import verify_jwt

app = FastAPI()

import models
from database import engine
models.Base.metadata.create_all(bind=engine)

@router.post("/upload-gemstone")
async def upload_gemstone_photo(
    file: UploadFile = File(...),
    title: str = "",
    description: str = "",
    token_data: dict = Depends(verify_jwt),
    db: Session = Depends(get_db)
):
    email = token_data["email"]
    photo_data = await file.read()

    new_photo = GemstonePhoto(
        email=email,
        filename=file.filename,
        data=photo_data,
        title=title,
        description=description
    )

    db.add(new_photo)
    db.commit()
    db.refresh(new_photo)

    return {
        "message": "Gemstone photo uploaded",
        "photo_id": new_photo.id,
        "filename": new_photo.filename,
        "title": new_photo.title,
        "description": new_photo.description,
    }

from fastapi.responses import JSONResponse
from fastapi import Request

@router.get("/gemstone-photos/{email}")
def get_gemstone_photos(email: str, request: Request, db: Session = Depends(get_db)):
    photos = db.query(GemstonePhoto).filter(GemstonePhoto.email == email).all()

    if not photos:
        raise HTTPException(status_code=404, detail="No photos found for this user")

    result = []
    for photo in photos:
        result.append({
            "id": photo.id,
            "url": f"{request.base_url}gemstone-photo/{photo.id}",
            "title": photo.title,
            "description": photo.description,
        })

    return JSONResponse(content={"email": email, "photos": result})

@router.get("/gemstone-photo/{photo_id}")
def get_photo(photo_id: int, db: Session = Depends(get_db)):
    photo = db.query(GemstonePhoto).filter(GemstonePhoto.id == photo_id).first()

    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    return Response(content=photo.data, media_type="image/jpeg")

from pydantic import BaseModel

class UpdatePhotoMetadata(BaseModel):
    title: str
    description: str

@router.put("/gemstone-photo/{photo_id}")
def update_photo_metadata(
    photo_id: int,
    metadata: UpdatePhotoMetadata,
    token_data: dict = Depends(verify_jwt),
    db: Session = Depends(get_db)
):
    email = token_data["email"]
    photo = db.query(GemstonePhoto).filter(GemstonePhoto.id == photo_id).first()

    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    if photo.email != email:
        raise HTTPException(status_code=403, detail="Unauthorized to update this photo")

    photo.title = metadata.title
    photo.description = metadata.description
    db.commit()

    return {"message": "Photo metadata updated"}