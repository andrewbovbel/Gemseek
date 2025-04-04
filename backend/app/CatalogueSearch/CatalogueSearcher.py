from ResultManagement.PastResults.pastResultsLoader import load_past_results
from artifacts.picture_loader import load_pictures
from GemHistory.GemHistoryLoader import get_gem_history

class CatalogueSearcher:

    def __init__(self):
        return

    def search(self, name_of_rock):
        past_results = load_past_results()  # Map of gem name → list of search IDs
        pictures = load_pictures()  # Map of gem ID → picture blob
        description = get_gem_history(name_of_rock) # Fetches description of Gem from gemHistory.json if available

        if name_of_rock not in past_results:
            return []  #if rock isn't in past results, then return empty list
        
        list_of_ids = past_results[name_of_rock]
        
        # Constructing a list of dictionaries containing name, ID, and picture
        search_results = [
            {
                "id": image_id,
                "name": name_of_rock,
                "picture": pictures.get(image_id, None)  # Get picture if available
            }
            for image_id in list_of_ids
        ]
        
        return {
            "description": description,
            "results": search_results
        }
