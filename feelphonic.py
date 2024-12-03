from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv
import os
import base64
from requests import post, get
import json


feelphonic = Flask(__name__)

load_dotenv()

client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")

def get_token():
    auth_string = client_id + ":" + client_secret
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"

    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {"grant_type": "client_credentials"}
    result = post(url, headers=headers, data=data)
    json_result = json.loads(result.content)
    token = json_result["access_token"]
    return token

#token = get_token()
#print(token)

@feelphonic.route("/search-artists", methods=['GET'])
def search_artist():
    url = "https://api.spotify.com/v1/search"
    query = request.args.get('query')
    
    if not query:
        return jsonify([])

    token = get_token()

    headers = {
        "Authorization": f"Bearer {token}"
    }

    params = {
        "q" : query,
        "type": "artist",
        "limit" : 5
    }
    
    response = get(url, headers=headers, params=params)

    data = response.json()

    artists = []

    for artist in data["artists"]["items"]:
        artists.append({
            "name" : artist["name"],
            "image" : artist["images"][0]["url"] if artist["images"] else None
        })

    return jsonify(artists)


@feelphonic.route("/")
def home():
    return render_template('index.html')

if __name__ == '__main__':
    feelphonic.run(debug=True)