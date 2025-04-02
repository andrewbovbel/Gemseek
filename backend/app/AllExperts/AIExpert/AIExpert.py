from AllExperts.AbsExpert import Expert
from Input.input import Input
import openai
from config.loader import config
from artifacts.picture_loader import load_pictures


class AIExpert(Expert):

    def __init__(self):
        self.client = openai.OpenAI(api_key=config["openai_api_key"])

    def _createPrompt(self, input: Input):
        pictures = load_pictures()
        image_blob = pictures[input.image_id]
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text",
                         "text": "what type of rock/gem is this? Reply only in the name of the rock/gem 1 word (singular form only). do not use past results to guide your decision."},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_blob}"
                            }
                        }
                    ]
                }
            ],
            max_tokens=3
        )
        return response

    def analyzeInput(self, input: Input) -> str:
        response = self._createPrompt(input)
        return response.choices[0].message.content



