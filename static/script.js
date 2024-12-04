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
    const songs = await response.json();

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