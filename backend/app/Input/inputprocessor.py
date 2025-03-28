from pydantic import BaseModel
from typing import Dict, List
from artifacts.picture_loader import save_blob


class InputProcessor(BaseModel):
    image: str
    properties: Dict[str, List[str]]

    def process_input(self):
        base64_image = self.image
        if "," in base64_image:
            base64_image = base64_image.split(",")[1]
        id = save_blob(base64_image)
        return id, self.properties
