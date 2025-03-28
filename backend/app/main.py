#from Input.inputprocessor import InputProcessor
from Input.input import Input
# from fastapi import FastAPI, HTTPException
from AllExperts.AIExpert.AIExpert import AIExpert
from AllExperts.ReverseImageExpert.ReverseImageExpert import ReverseImageExpert
from AllExperts.DatabaseExpert.DataBaseExpert import DataBaseExpert
from AllExperts.Experts import Experts
from blackboard.ExpertWeights import ExpertWeights
from blackboard.ExpertType import ExpertType
from blackboard.GemstoneBlackBoard import GemstoneBlackBoard


# app = FastAPI()
#
# @app.post("/upload")
# async def upload_image(payload: InputProcessor):
#     try:
#         image_id, properties = payload.process_input()
#         input = Input(image_id, properties)
#         print(type(input).__name__)
#         return {"image_ath": input.image_id, "properties": input.properties}
#     except Exception as e:
#         raise HTTPException(status_code=400, detail=f"Image decoding failed: {str(e)}")


def test():
    ai_expert = AIExpert("he")
    reverseImageExpert = ReverseImageExpert("he")
    databaseExpert = DataBaseExpert("he")
    experts = Experts([ai_expert, reverseImageExpert, databaseExpert])
    weights = {
        ExpertType.AIExpert: 0.4,
        ExpertType.ReverseImageExpert: 0.3,
        ExpertType.DataBaseExpert: 0.3
    }
    expert_weights = ExpertWeights(weights)
    dummy_input = Input(4,2)
    gemstoneBlackBoard = GemstoneBlackBoard(experts, expert_weights, dummy_input)
    gemstoneBlackBoard.activate_experts()
    x = gemstoneBlackBoard.determineFinalAnswer()
    print(x)


test()