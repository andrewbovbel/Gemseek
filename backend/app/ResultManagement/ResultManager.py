from ResultManagement.PastResults.pastResultsLoader import load_past_results,save_past_results

class ResultManager:

    def __init__(self):
        return

    def save(self, gem_name :str, picture_id :str) -> None:
        picture_id = str(picture_id)
        past_results = load_past_results()
        if gem_name in past_results.keys():
            if picture_id not in past_results[gem_name]:
                past_results[gem_name].append(picture_id)
        else:
            past_results[gem_name] = [picture_id]
        save_past_results(past_results)
