from ResultManagement.PastResults.pastResultsLoader import load_past_results
from artifacts.picture_loader import load_pictures

class CatalogueSearcher:

    def __init__(self):
        return

    def search(self, name_of_rock):
        list_of_image_blobs = []
        past_results = load_past_results()
        list_of_ids = past_results[name_of_rock]
        pictures = load_pictures()
        for image_id in list_of_ids:
            list_of_image_blobs.append(pictures[image_id])
        return list_of_image_blobs