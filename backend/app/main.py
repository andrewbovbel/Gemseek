from Input.inputprocessor import InputProcessor
from Input.input import Input
from fastapi import FastAPI, HTTPException, Body
from AllExperts.AIExpert.AIExpert import AIExpert
from AllExperts.ReverseImageExpert.ReverseImageExpert import ReverseImageExpert
from AllExperts.DatabaseExpert.DataBaseExpert import DataBaseExpert
from AllExperts.Experts import Experts
from blackboard.ExpertWeights import ExpertWeights
from blackboard.ExpertType import ExpertType
from blackboard.GemstoneBlackBoard import GemstoneBlackBoard
from ResultManagement.ResultManager import ResultManager
from CatalogueSearch.CatalogueSearcher import CatalogueSearcher
from blackboard.ExpertWeights import ExpertWeights
from ReweighExperts.ExpertReweigher import ExpertReweigher
from GemHistory.GemHistoryLoader import get_gem_history
app = FastAPI()

weights = {
    ExpertType.AIExpert: 0.52,
    ExpertType.ReverseImageExpert: 0.28,
    ExpertType.DataBaseExpert: 0.2
}
expert_weights = ExpertWeights(weights)

@app.post("/upload")
async def upload(payload: InputProcessor):
    try:
        image_id, properties = payload.process_input()
        input = Input(image_id, properties)
        ai_expert = AIExpert()
        reverseImageExpert = ReverseImageExpert()
        databaseExpert = DataBaseExpert()
        experts = Experts([ai_expert, reverseImageExpert, databaseExpert])
        gemstoneBlackBoard = GemstoneBlackBoard(experts, expert_weights, input)
        gemstoneBlackBoard.activate_experts()
        rock_name = gemstoneBlackBoard.determineFinalAnswer()
        gem_history = get_gem_history(rock_name)
        result_manager = ResultManager()
        result_manager.save(rock_name, input.image_id)
        return {"gem_name": rock_name, "gem_history": gem_history}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image decoding failed: {str(e)}")

@app.get("/rock/{rock_name}")
def get_rock(rock_name: str):
    try:
        searcher = CatalogueSearcher()
        rock_name = rock_name.lower()
        list_of_blobs = searcher.search(rock_name)
        return list_of_blobs
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"{str(e)}")

@app.post("/reshuffle")
def check_integer(value: int = Body(..., embed=True)):
    try:
        expert_weights = ExpertWeights.getInstance()
        reweigh_experts = ExpertReweigher()
        if value == -1:
            reweigh_experts.reshuffle_negative()

        if value == 1:
           reweigh_experts.reshuffle_positive()
        # Convert Enum keys to string for JSON serialization
        weights = expert_weights.getAllWeights()
        weights_as_str = {expert.name: weight for expert, weight in weights.items()}
        return {"message": weights_as_str}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"{str(e)}")
