document.getElementById("getrecommendations").addEventListener('click' , () => {
    setTimeout(() =>{
        document.getElementById("songs-section").scrollIntoView({behavior: "smooth"});
    }, 4000);
});
async function showSongs(){
    document.getElementById("songs-section").style.display = "block";
    
    const numberOfTracks = document.getElementById("numberoftracks").value;
    const trimmedMood = moodText.trim();


    const query = {
        mood: trimmedMood,
        artists: selectArtist2,
        numberOfTracks: parseInt(numberOfTracks),
        ids: artistsID
    };

    const response = await fetch('/search-songs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(query)
    });
    const moodsongs = await response.json();

    const songBoxDiv = document.getElementById("songs-boxes");
    songBoxDiv.innerHTML = '';

    if(moodsongs.length>0){
        moodsongs.forEach(song => {
            const card = document.createElement('a');
            card.href = `${song.url}`
            card.classList.add('card'); 
                    card.innerHTML = `
                <div class="image-holder">
                    <img src="${song.image || 'default-image-url.jpg'}" alt="${song.artist_name}">
                </div>
                <div class="song-text">
                    <h2>${song.track_name}</h2>
                    <p>${song.artist_name}</p>
                </div>
                <div class="play-icon">
                    <div class="circle">
                        <div class="triangle"></div>
                    </div>
                </div>
            `;
        
            // Append the card to the parent container
            songBoxDiv.append(card);
        });
        
    }
}

// Arist searchbox filter

const artistSearch = document.getElementById("artistSearch");
const artistList = document.getElementById("artistList");

let selectedArtists = []
let selectArtist2 = []
let artistsID = []

async function filterDropdown() {
    const query = artistSearch.value.trim();
    if (!query) {
        artistList.style.display = 'none';
        return;
    }

    const response = await fetch(`/search-artists?query=${query}`);
    const artists = await response.json()

    artistList.innerHTML = '';

    if (artists.length > 0) {
        artists.forEach(artist => {
            const li = document.createElement('li');
            li.classList.add('artist-item');
            li.innerHTML = `
                <div class="image-name">
                    <img src="${artist.image || 'default-image-url'}" alt="${artist.name}">
                    <span class="name">${artist.name}</span>
                </div>
            `;
            li.addEventListener('click', () => selectArtist(artist.name, artist.image, artist.id));
            artistList.appendChild(li);
            
        });
        artistList.style.display = 'block';
    } else {
        artistList.style.display = 'none';
    }
}

// Handling artist selection
function displayArtist(){
    const selectedArtistDiv = document.getElementById("selectedArtist");
    selectedArtistDiv.innerHTML = "";

    selectedArtists.forEach((artist, index) =>{
        const artistboxDiv = document.createElement("div")
        artistboxDiv.innerHTML =`
                    <img src="${artist.image || 'default-image-url'}" alt="${artist.name}">
                    <span class="name">${artist.name}</span> 
        `
        selectedArtistDiv.appendChild(artistboxDiv);

    });



}
function selectArtist(artist, image, id) {
    selectedArtists.push({name: artist, image: image});
    selectArtist2.push(artist);
    artistsID.push(id)
    displayArtist();
    document.getElementById('artistSearch').value = artist;
    document.getElementById('artistList').style.display = "none";

}

//handling mood selection
const moodBoxes = document.querySelectorAll('.box');

let moodText = ""

moodBoxes.forEach(box => {
  box.addEventListener('click', () => {
    moodBoxes.forEach(otherBox => {
      otherBox.classList.remove('selected');
    });

    box.classList.add('selected');

    moodText = box.querySelector('.mood-text').textContent;
    console.log('Selected mood:', moodText);
  });
});