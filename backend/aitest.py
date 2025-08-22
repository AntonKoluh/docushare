import requests
import json

url = r"http://192.168.0.133:11434/api/generate"
req = {
  "model": "phi3:mini",
  "prompt": "Why is the sky blue?"
}

full = ""

with requests.post(url, json=req, stream=True) as r:
    r.raise_for_status()
    for chunk in r.iter_content(chunk_size=None):
        if chunk:
            data = json.loads(chunk.decode('utf-8'))
            full += data['response']
            print (full)


