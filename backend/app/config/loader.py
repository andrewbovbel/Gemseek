import json


def load_config():
    config_path = "./config/config.json"
    with open(config_path, "r") as f:
        return json.load(f)

def save_config(new_config):
    config_path = "./config/config.json"
    with open(config_path, "w") as f:
        json.dump(new_config, f, indent=4)

config = load_config()