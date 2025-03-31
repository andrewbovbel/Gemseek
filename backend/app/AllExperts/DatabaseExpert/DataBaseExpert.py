from AllExperts.AbsExpert import Expert
from Input.input import Input
import json
from config.loader import config

class DataBaseExpert(Expert):

    def __init__(self):
        file_path = config["geomaterials_database_path"]
        with open(file_path, "r", encoding="utf-8") as file:
            self.data = json.load(file)

    def analyzeInput(self, input) -> str:
        filtered_materials = [m for m in self.data["results"] if self._matches_all_filters(m, input.properties)]
        return filtered_materials[0]["name"].lower()


    def _matches_all_filters(self, obj, filters):
        for key, required_values in filters.items():
            obj_values = obj.get(key, [])
            if not all(val in obj_values for val in required_values):
                return False
        return True
