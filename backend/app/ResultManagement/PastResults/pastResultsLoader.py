import json


def load_past_results():
    config_path = "./ResultManagement/PastResults/pastResults.json"
    with open(config_path, "r") as f:
        return json.load(f)

def save_past_results(new_config):
    config_path = "./ResultManagement/PastResults/pastResults.json"
    with open(config_path, "w") as f:
        json.dump(new_config, f, indent=4)


