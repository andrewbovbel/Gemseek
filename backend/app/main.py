from Input.inputprocessor import InputProcessor
from Input.input import Input
from fastapi import FastAPI, HTTPException
from config.loader import config
import base64

app = FastAPI()

@app.post("/upload")
async def upload_image(payload: InputProcessor):
    try:
        image_path, properties = payload.process_input()
        input = Input(image_path, properties)
        return {"image_ath": image_path, "properties": properties}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image decoding failed: {str(e)}")
