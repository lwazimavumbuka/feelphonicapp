function showSongs(){
    document.getElementById("songs-section").style.display = "block";
}

// Arist searchbox filter

const artistSearch = document.getElementById("artistSearch");
const artistList = document.getElementById("artistList");

function filterDropdown(type) {
    const searchBox = document.getElementById(type + 'Search');
    const list = document.getElementById(type + 'List');
    const items = list.getElementsByTagName('li');
    const query = searchBox.value.toLowerCase();
    let matches = 0;

    Array.from(items).forEach(li => {
        const itemName = li.textContent.toLowerCase();
        if (itemName.includes(query)) {
            li.style.display = "block"; 
            matches++;
        } else {
            li.style.display = "none";
        }
    });

    list.style.display = matches > 0 ? "block" : "none";
}

// Handling artist selection
function selectArtist(artist) {
    document.getElementById('artistSearch').value = artist;
    document.getElementById('artistList').style.display = "none";
}

// Handling genre selection
function selectGenre(genre) {
    document.getElementById('genreSearch').value = genre;
    document.getElementById('genreList').style.display = "none";
}

// Add event listeners for artist items
Array.from(document.getElementById('artistList').getElementsByTagName('li')).forEach(li => {
    li.addEventListener('click', () => selectArtist(li.textContent));
});

// Add event listeners for genre items
Array.from(document.getElementById('genreList').getElementsByTagName('li')).forEach(li => {
    li.addEventListener('click', () => selectGenre(li.textContent));
});
