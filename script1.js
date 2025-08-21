console.log("Let's start JavaScript!");

// -------------------- GLOBAL VARIABLES --------------------
let currentAudio = null;
let currentSongIndex = 0;
let allSongs = [];
let navigationHistory = [];
let currentHistoryIndex = -1;

// -------------------- UTILITY FUNCTIONS --------------------
function secondsToMinutesSeconds(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// -------------------- SONG PLAYBACK --------------------
function loadSong(index) {
  if (!allSongs.length || index < 0 || index >= allSongs.length) return;

  currentSongIndex = index;
  const song = allSongs[index];

  if (currentAudio) currentAudio.pause();
  currentAudio = new Audio(song.src);
  currentAudio.preload = "metadata";

  // Wait for metadata before updating duration
  currentAudio.addEventListener("loadedmetadata", () => {
    document.querySelector(".songtime").textContent = `00:00 / ${secondsToMinutesSeconds(currentAudio.duration)}`;
  });

  currentAudio.addEventListener("timeupdate", () => {
    if (!isNaN(currentAudio.duration)) {
      document.querySelector(".songtime").textContent =
        `${secondsToMinutesSeconds(currentAudio.currentTime)} / ${secondsToMinutesSeconds(currentAudio.duration)}`;
      document.querySelector(".circle").style.left =
        (currentAudio.currentTime / currentAudio.duration) * 100 + "%";
    }
  });

  document.getElementById("songText").textContent = `${song.title} — ${song.artist}`;
  const img = document.getElementById("currentSongImg");
  if (img) {
    img.src = song.img || "";
    img.style.display = song.img ? "block" : "none";
  }
}

// Play/Pause button
document.getElementById("play").addEventListener("click", () => {
  if (!currentAudio) return;
  const playPromise = currentAudio.paused ? currentAudio.play() : currentAudio.pause();
  if (playPromise !== undefined) playPromise.catch(() => console.log("User tap required on mobile"));
  document.getElementById("play").src = currentAudio.paused ? "play.svg" : "pause.svg";
});

// Next/Previous buttons
document.getElementById("next").addEventListener("click", () => loadSong((currentSongIndex + 1) % allSongs.length));
document.getElementById("previous").addEventListener("click", () => loadSong((currentSongIndex - 1 + allSongs.length) % allSongs.length));

// -------------------- SEEKBAR --------------------
const seekbar = document.querySelector(".seekbar");
seekbar.addEventListener("click", (e) => {
  if (!currentAudio || isNaN(currentAudio.duration)) return;
  const percent = e.offsetX / e.target.getBoundingClientRect().width;
  currentAudio.currentTime = currentAudio.duration * percent;
  document.querySelector(".circle").style.left = percent * 100 + "%";
});

// -------------------- SONG CARDS --------------------
function setupImageClickHandlers() {
  document.querySelectorAll(".spotify-img").forEach((img, index) => {
    img.onclick = () => {
      currentSongIndex = index;
      loadSong(index);
      currentAudio.play().catch(() => console.log("User tap required"));
    };
  });
}

function getAllSongs() {
  const cards = document.querySelectorAll(".spotify-img");
  return Array.from(cards).map((img) => ({
    src: img.dataset.songs,
    title: img.dataset.title,
    artist: img.dataset.artist,
    img: img.src,
  }));
}

// -------------------- PLAYLISTS --------------------
const playlists = {
  "Lo-Fi Chill": [
    {src: "multiple playlists/Lo-Fi Chill/chillout-cafe-4176.mp3", title: "chillout-cafe", artist: "Relaxing music", img: "https://source.boomplaymusic.com/group10/M00/09/12/50443fa0e4104f829239e33cb34ff43c_464_464.webp"}
  ],
  "Morning Calm": [
    {src: "multiple playlists/Morning Calm/Blue - (Raag.Fm).mp3", title: "Blue", artist: "Yung kai", img: "https://i.scdn.co/image/ab67616d00001e02373c63a4666fb7193febc167"}
  ]
  // Add other playlists here
};

function loadPlaylist(name) {
  const playlist = playlists[name];
  if (!playlist) return;
  document.getElementById("playlistTitle").textContent = name;

  const container = document.querySelector(".cardContainer");
  container.innerHTML = "";

  playlist.forEach((song, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${song.img}" class="spotify-img" data-songs="${song.src}" data-title="${song.title}" data-artist="${song.artist}" />
      <h2>${song.title}</h2>
      <p>${song.artist}</p>
    `;
    container.appendChild(card);
  });

  allSongs = getAllSongs();
  setupImageClickHandlers();
}

// -------------------- SEARCH --------------------
function showSearchInterface() {
  document.getElementById("playlistTitle").textContent = "Search";
  const container = document.querySelector(".cardContainer");
  container.innerHTML = `
    <input type="text" id="searchInput" placeholder="Search..." />
    <button id="searchButton">Search</button>
    <div id="searchResults"></div>
  `;
  document.getElementById("searchButton").addEventListener("click", performSearch);
}

function performSearch() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const resultsDiv = document.getElementById("searchResults");
  let results = [];
  Object.keys(playlists).forEach(pl => {
    playlists[pl].forEach(song => {
      if (song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query)) results.push(song);
    });
  });

  if (!results.length) resultsDiv.innerHTML = "<p>No results found</p>";
  else resultsDiv.innerHTML = results.map(song => `
    <div class="search-result" onclick="playSearch('${song.src}')">${song.title} — ${song.artist}</div>
  `).join('');
}

function playSearch(src) {
  const index = allSongs.findIndex(s => s.src === src);
  if (index !== -1) loadSong(index);
  currentAudio.play().catch(() => console.log("User tap required"));
}

// -------------------- INIT --------------------
document.addEventListener("DOMContentLoaded", () => {
  allSongs = getAllSongs();
  loadSong(0);
  setupImageClickHandlers();
});
