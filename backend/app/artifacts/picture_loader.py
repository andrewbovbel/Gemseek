import json

def load_pictures():
    try:
        with open("./artifacts/pictures_blob.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}

def save_blob(blob):
    pictures = "./artifacts/pictures_blob.json"
    x = load_pictures()

    # Convert keys to int for finding the max, if any
    keys = [int(k) for k in x.keys()] if x else []
    next_key = str(max(keys) + 1) if keys else "1"

    x[next_key] = blob

    with open(pictures, "w") as f:
        json.dump(x, f, indent=4)

    return next_key
