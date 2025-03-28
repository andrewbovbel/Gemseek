from typing_extensions import Dict


class Input():
    image_id: str
    properties: Dict[str, list[str]]

    def __init__(self, image_id, properties):
        self.image_id = image_id
        self.properties = properties