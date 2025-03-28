from Input.inputprocessor import InputProcessor
from Input.input import Input
from fastapi import FastAPI, HTTPException


app = FastAPI()

@app.post("/upload")
async def upload_image(payload: InputProcessor):
    try:
        image_id, properties = payload.process_input()
        input = Input(image_id, properties)
        return {"image_ath": input.image_id, "properties": input.properties}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image decoding failed: {str(e)}")
