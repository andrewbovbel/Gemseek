from sqlalchemy import Column, String, Integer, LargeBinary, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from database import Base


# ✅ Photo Model (Supports Multiple Photos per Post)

# models.py
from sqlalchemy import Column, Integer, String, LargeBinary
from database import Base

class GemstonePhoto(Base):
    __tablename__ = "gemstone_photos"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    filename = Column(String)
    data = Column(LargeBinary)
    title = Column(String, default="")
    description = Column(String, default="")