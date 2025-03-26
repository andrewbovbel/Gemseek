from pydantic import BaseModel
from typing import Dict, List, ClassVar
from config.loader import config, save_config
import base64
import os

class InputProcessor(BaseModel):
    image: str
    properties: Dict[str, List[str]]

    def process_input(self):
        base64_image = self.image

        if "," in base64_image:
            base64_image = base64_image.split(",")[1]

        image_data = base64.b64decode(base64_image)


        os.makedirs("./artifacts", exist_ok=True)

        image_path = f"./artifacts/{config["gem_id"]}.png"
        config["gem_id"] += 1
        save_config(config)
        with open(image_path, "wb") as f:
            f.write(image_data)

        return image_path, self.properties
