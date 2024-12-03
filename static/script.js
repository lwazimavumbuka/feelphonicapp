function showSongs(){
    document.getElementById("songs-section").style.display = "block";
}

// Arist searchbox filter

const artistSearch = document.getElementById("artistSearch");
const artistList = document.getElementById("artistList");
const selectedArtist = document.getElementById("selectedArtist");

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
            li.addEventListener('click', () => selectArtist(artist.name));
            artistList.appendChild(li);
        });
        artistList.style.display = 'block';
    } else {
        artistList.style.display = 'none';
    }
}

// Handling artist selection
function selectArtist(artist) {
    document.getElementById('artistSearch').value = artist;
    document.getElementById('artistList').style.display = "none";
}
