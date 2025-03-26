from typing_extensions import Dict


class Input():
    image_path: str
    properties: Dict[str, List[str]]

    def __init__(self, image_path, properties):
        self.image_path = image_path
        self.properties = properties