from AllExperts.AbsExpert import Expert
from Input.input import Input
from config.loader import config
from artifacts.picture_loader import load_pictures
from google import genai
from google.genai import types
import base64


class ReverseImageExpert(Expert):

    def __init__(self):
        self.client = genai.Client(api_key=config["google_api_key"])

    def _createPrompt(self, input: Input):
        pictures = load_pictures()
        image_blob = pictures[input.image_id]
        # Decode the base64 image into bytes
        image_bytes = base64.b64decode(image_blob)
        response = self.client.models.generate_content(
            model="gemini-2.0-flash-exp",
            contents=[
                "what type of gem/rock is in this image. (reply only by the name of the rock, no more than 1-2 words) no full stop only singular form",
                types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg")])

        return response

    def analyzeInput(self, input: Input) -> str:
        response = self._createPrompt(input)
        return response.text



