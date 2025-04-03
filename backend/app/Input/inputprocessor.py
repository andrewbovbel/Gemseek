from pydantic import BaseModel
from typing import Dict, List
from artifacts.picture_loader import save_blob


class InputProcessor(BaseModel):
    image_id: str
    properties: Dict[str, List[str]]

    def process_input(self):
        if not self.image_id:
            raise ValueError("Image ID is required.")
        base64_image = self.image_id
        if "," in base64_image:
            base64_image = base64_image.split(",")[1]
        id = save_blob(base64_image)
        return id, self.properties
