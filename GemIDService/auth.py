from fastapi import Header, HTTPException
from jwt import ExpiredSignatureError, InvalidTokenError, decode

JWT_SECRET = "sushi"
JWT_ALGORITHM = "HS256"

# ✅ Function to verify JWT token and decode email
def verify_jwt(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization token missing or invalid")

    token = authorization.split("Bearer ")[1]

    try:
        decoded_token =decode (token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_token
    # except ExpiredSignatureError:
    #     raise HTTPException(status_code=401, detail="Token expired")
    except InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
