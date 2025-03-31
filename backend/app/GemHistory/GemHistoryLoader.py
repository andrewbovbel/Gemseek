import json


def load_gem_history():
    config_path = "./GemHistory/gemhistory.json"
    with open(config_path, "r") as f:
        return json.load(f)


def get_gem_history(gem_name):
    x = load_gem_history()
    if gem_name in x:
        return x[gem_name]
    else:
        return "none"