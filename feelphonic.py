from flask import Flask, render_template, jsonify, request
from dotenv import load_dotenv
import os
import base64
from requests import post, get
import json
import random

import requests


feelphonic = Flask(__name__)

load_dotenv()

client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")

mood_to_audio = {
    "happy": {"valence": 0.8, "energy": 0.8, "danceability": 0.9},
    "sad": {"valence": 0.2, "energy": 0.2, "danceability": 0.3},
    "chill": {"valence": 0.5, "energy": 0.4, "danceability": 0.5},
    "heartbreak": {"valence": 0.2, "energy": 0.3, "danceability": 0.3},
    "romantic": {"valence": 0.6, "energy": 0.4, "danceability": 0.5},
    "nostalgic": {"valence": 0.4, "energy": 0.4, "danceability": 0.5},
    "focused": {"valence": 0.3, "energy": 0.2, "danceability": 0.3},
    "sleepy": {"valence": 0.2, "energy": 0.1, "danceability": 0.2}
}

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
            "id": artist["id"],
            "name" : artist["name"],
            "image" : artist["images"][0]["url"] if artist["images"] else None
        })

    return jsonify(artists)

@feelphonic.route("/search-songs", methods=['POST'])
def get_recomendations():
    data = request.json
    mood = str(data.get('mood', '').strip()).lower()
    artists = data.get('artists', [])
    number_of_tracks = data.get('numberOfTracks', 10)
    ids = data.get('ids')
    
    token = get_token()

    moodtracks = []
    
    for artistname in artists:
        query = artistname +' '+ mood
        print(query)
        url = "https://api.spotify.com/v1/search?q="+query+"&type=playlist&limit=1"
    
        headers = {
            "Authorization": f"Bearer {token}"
        }
        response = get(url, headers=headers)
        response.raise_for_status()
        
        playlists = response.json().get('playlists', {}).get('items', [])


        if not playlists:
            print("No playlists found.")
            return
        
        trackslist = []

        print("Playlists found:")
        for playlist in playlists:
            url =  "https://api.spotify.com/v1/playlists/"+playlist['id']+"/tracks"
            
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            tracks = response.json().get('items', [])

            for track in tracks:
                track_info = track['track']
                trackslist.append({
                    "track_name": track_info['name'],
                    "artist_name": ", ".join(artist['name'] for artist in track_info['artists']),
                    "url": track_info['external_urls']['spotify'],
                    "image": track_info['album']['images'][0]['url'] if track_info['album']['images'] else 'No image available'

                })
                
    moodtracklist = []
    for x in range(number_of_tracks):
        moodtracklist.append(random.choice(trackslist))

    return jsonify(moodtracklist)




@feelphonic.route("/")
def home():
    return render_template('index.html')

if __name__ == '__main__':
    feelphonic.run(debug=True)