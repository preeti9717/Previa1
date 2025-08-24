console.log("Let's start JavaScript!");

let currentAudio = null;
let songs = [];

function secondsToMinutesSeconds(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function playMusic(src, title = "", artist = "", imgSrc = "") {
  currentAudio?.pause();
  currentAudio = new Audio(src);

  // Attach the timeupdate listener here
  currentAudio.addEventListener("timeupdate", () => {
    if (currentAudio && currentAudio.duration && !isNaN(currentAudio.duration)) {
      document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
        currentAudio.currentTime
      )}/${secondsToMinutesSeconds(currentAudio.duration)}`;
      document.querySelector(".circle").style.left =
        (currentAudio.currentTime / currentAudio.duration) * 100 + "%";
    }
  });

  //add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    if (currentAudio && currentAudio.duration) {
      let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
      document.querySelector(".circle").style.left = percent + "%";
      currentAudio.currentTime = (currentAudio.duration * percent) / 100;
    }
  });
  currentAudio.play().catch(error => {
    console.error("Playback failed:", error);
    document.getElementById("play").src = "play.svg";
  });
  document.getElementById("play").src = "pause.svg";
  
  // Update song image and text
  const songImg = document.getElementById('currentSongImg');
  const songText = document.getElementById('songText');
  
  if (imgSrc) {
    songImg.src = imgSrc;
    songImg.style.display = 'block';
  } else {
    songImg.style.display = 'none';
  }
  
  songText.innerHTML = `${title} — ${artist}`;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

async function getSongs() {
  // Return static list of songs since we're not using a server
  return [
    "songs/Sapphire - (Raag.Fm).mp3",
    "songs/Jugraafiya - (Raag.Fm).mp3", 
    "songs/Jhol.mp3",
    "songs/Shree Hanuman Chalisa - (Raag.Fm).mp3",
    "songs/Apt.mp3",
    "songs/Dietmountaindew.mp3",
    "songs/BrunoMars-TheLazySong.mp3",
    "songs/luther(with sza).mp3"
  ];
}

function setupImageClickHandlers() {
  document.querySelectorAll(".spotify-img").forEach((img, index) => {
    img.onclick = () => {
      const song = img.dataset.songs;
      const title = img.dataset.title;
      const artist = img.dataset.artist;
      const imgSrc = img.src;

      if (!song) return;

      const src = encodeURI(song);
      
      // Set current song index for navigation
      currentSongIndex = index;
      if (!allSongs.length) allSongs = getAllSongs();

      if (currentAudio?.src === src) {
        currentAudio.paused ? currentAudio.play() : currentAudio.pause();
        return;
      } else {
        playMusic(src, title, artist, imgSrc);
      }
    };
  });
}

async function main() {
  // IMP@! let currentSong;
  songs = await getSongs();
  console.log("Songs from server:", songs);

  // Auto-play first song (optional)
  // if (songs.length) {playMusic(songs[0])}
}

setupImageClickHandlers();

//attach an event listener to play,next and previous buttons
document.getElementById("play").addEventListener("click", () => {
  if (currentAudio) {
    if (currentAudio.paused) {
      currentAudio.play();
      document.getElementById("play").src = "pause.svg";
    } else {
      currentAudio.pause();
      document.getElementById("play").src = "play.svg";
    }
  }
});

let currentSongIndex = 0;
let allSongs = [];

// Navigation history
let navigationHistory = [];
let currentHistoryIndex = -1;

// Get all songs from cards
function getAllSongs() {
  const cards = document.querySelectorAll('.spotify-img');
  return Array.from(cards).map(img => ({
    src: encodeURI(img.dataset.songs),
    title: img.dataset.title,
    artist: img.dataset.artist
  }));
}

//add an event listener to previous
document.getElementById("previous").addEventListener("click", () => {
  if (!allSongs.length) allSongs = getAllSongs();
  if (currentSongIndex > 0) {
    currentSongIndex--;
    const song = allSongs[currentSongIndex];
    playMusic(song.src, song.title, song.artist);
  }
});

//Add an event listener to next
document.getElementById("next").addEventListener("click", () => {
  if (!allSongs.length) allSongs = getAllSongs();
  if (currentSongIndex < allSongs.length - 1) {
    currentSongIndex++;
    const song = allSongs[currentSongIndex];
    playMusic(song.src, song.title, song.artist);
  }
});
//add an event listener to hamburger
document.querySelector(".hamburger").addEventListener("click", () => {
  document.querySelector(".left").classList.add("show");
});

//add an event listener to close button
document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").classList.remove("show");
});

//close sidebar when clicking outside on mobile
document.addEventListener("click", (e) => {
  const left = document.querySelector(".left");
  const hamburger = document.querySelector(".hamburger");
  
  if (window.innerWidth <= 1024 && 
      left.classList.contains("show") && 
      !left.contains(e.target) && 
      !hamburger.contains(e.target)) {
    left.classList.remove("show");
  }
});

//volume control
document.getElementById("volumeSlider").addEventListener("input", (e) => {
  if (currentAudio) {
    currentAudio.volume = e.target.value / 100;
  }
});

//playlist functionality
const playlists = {
  "Lo-Fi Chill": [
    {src: "multiple playlists/Lo-Fi Chill/chillout-cafe-4176.mp3", title: "chillout-cafe", artist: "Relaxing music", img: "https://source.boomplaymusic.com/group10/M00/09/12/50443fa0e4104f829239e33cb34ff43c_464_464.webp"},
    {src: "multiple playlists/Lo-Fi Chill/crystalline-flow_medium-1-367713.mp3", title: "crystalline-flow", artist: "Grand_Project", img: "https://cdn.pixabay.com/audio/2025/06/29/17-43-14-660_200x200.jpg"},
    {src: "multiple playlists/Lo-Fi Chill/paper-planes-chill-future-beat-283956.mp3", title: "paper-planes", artist: "kulakovka", img: "https://cdn.pixabay.com/audio/2025/01/05/05-57-08-998_200x200.jpg"}
  ],
  "Morning Calm": [
    {src: "multiple playlists/Morning Calm/Blue - (Raag.Fm).mp3", title: "Blue", artist: "Yung kai", img: "https://i.scdn.co/image/ab67616d00001e02373c63a4666fb7193febc167"},
    {src: "multiple playlists/Morning Calm/meditation-music-368634.mp3", title: "meditation-music", artist: "SigmaMusicArt", img: "https://cdn.pixabay.com/audio/2025/07/01/20-56-32-563_200x200.png"},
    {src: "multiple playlists/Morning Calm/The-Night-We-Met.mp3", title: "The-Night-We-Met", artist: "Lord Huron", img: "https://i.scdn.co/image/ab67616d00001e0217875a0610c23d8946454583"}
  ],
  "Party Booster": [
    {src: "multiple playlists/Party Booster/Blinding Lights - The Weeknd.mp3", title: "Blinding Lights", artist: "The Weekend", img: "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36"},
    {src: "multiple playlists/Party Booster/Dance Monkey - Tones And I.mp3", title: "Dance Monkey", artist: "Tones And I", img: "https://i.scdn.co/image/ab67616d00001e02c6f7af36ecdc3ed6e0a1f169"},
    {src: "multiple playlists/Party Booster/Dua Lipa - Levitating.mp3", title: "Levitating", artist: "Dua Lipa", img: "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f"},
    {src: "multiple playlists/Party Booster/Uptown Funk (feat. Bruno Mars) - Mark Ronson.mp3", title: "Uptown Funk (feat. Bruno Mars)", artist: "Mark Ronson(feat. Bruno Mars)", img: "https://i.scdn.co/image/ab67616d00001e02e419ccba0baa8bd3f3d7abf2"}
  ],
  "Workout Vibes": [
    {src: "multiple playlists/Workout Vibes/Shaky.mp3", title: "Shaky", artist: "Sanju Rathod", img: "https://i.scdn.co/image/ab6761610000517403ae58450e917e4e075f6e1d"},
    {src: "multiple playlists/Workout Vibes/BijleeBijlee.mp3", title: "Bijlee Bijlee", artist: "Harrdy Sandhu", img: "https://i.scdn.co/image/ab67616d00001e02b5a26cb2c2ef2fa440baffb0"},
    {src: "multiple playlists/Workout Vibes/BTS - MIC Drop (Steve Aoki Remix) (Clean Remix).mp3", title: "MIC Drop(Steve Aoki Remix)", artist: "BTS,Steve Aoki", img: "https://i.scdn.co/image/ab67616d00001e023825e6d4d02e4b4c0cec7e1d"}
  ]
};

//playlist click handlers
document.querySelectorAll('.playlist-item').forEach(item => {
  item.addEventListener('click', () => {
    const playlistName = item.dataset.playlist;
    navigateToPage({type: 'playlist', name: playlistName});
  });
});

//create playlist button
document.getElementById('createPlaylistBtn').addEventListener('click', () => {
  const playlistName = prompt('Enter playlist name:');
  if (playlistName) {
    createNewPlaylist(playlistName);
  }
});

function loadPlaylist(playlistName) {
  const playlist = playlists[playlistName];
  if (!playlist) return;
  
  document.getElementById('playlistTitle').textContent = playlistName;
  const cardContainer = document.querySelector('.cardContainer');
  cardContainer.innerHTML = '';
  
  playlist.forEach((song, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${song.img}" 
           alt="${song.title}" class="spotify-img" 
           data-songs="${song.src}" data-title="${song.title}" data-artist="${song.artist}" />
      <h2>${song.title}</h2>
      <p>${song.artist}</p>
      <div class="play">
        <img src="playB.png" alt="play" />
      </div>
    `;
    cardContainer.appendChild(card);
  });
  
  setupImageClickHandlers();
  allSongs = getAllSongs();
}

function createNewPlaylist(name) {
  const playlistList = document.querySelector('.playlist-list');
  const newPlaylist = document.createElement('div');
  newPlaylist.className = 'playlist-item';
  newPlaylist.dataset.playlist = name;
  newPlaylist.innerHTML = `
    <img class="invert" src="playlist.svg" alt="playlist" />
    <span>${name}</span>
  `;
  
  newPlaylist.addEventListener('click', () => {
    loadPlaylist(name);
  });
  
  playlistList.appendChild(newPlaylist);
  playlists[name] = [];
  alert(`Playlist "${name}" created successfully!`);
}

//home button functionality
document.getElementById('homeBtn').addEventListener('click', () => {
  navigateToPage({type: 'home'});
});

//search button functionality
document.getElementById('searchBtn').addEventListener('click', () => {
  navigateToPage({type: 'search'});
});

//signup button functionality
document.getElementById('signupBtn').addEventListener('click', () => {
  showSignupForm();
});

//login button functionality
document.getElementById('loginBtn').addEventListener('click', () => {
  showLoginForm();
});

function loadHomePage() {
  document.getElementById('playlistTitle').textContent = 'All Songs';
  const cardContainer = document.querySelector('.cardContainer');
  
  // Original songs from main collection
  const originalSongs = [
    {src: "songs/Sapphire - (Raag.Fm).mp3", title: "Sapphire", artist: "Ed Sheeran", img: "https://i.scdn.co/image/ab67616d00001e026fbb60d6a7e03ccb940a518e"},
    {src: "songs/Jugraafiya - (Raag.Fm).mp3", title: "Jugraafiya", artist: "Udit Narayan,Shreya Ghoshal", img: "https://i.scdn.co/image/ab67616d00001e02e76275da5828d6f937c3bcf3"},
    {src: "songs/Jhol.mp3", title: "Jhol", artist: "Rifat karim", img: "https://i.scdn.co/image/ab67616d00001e023e67a771f28e4e01acda08fb"},
    {src: "songs/Shree Hanuman Chalisa - (Raag.Fm).mp3", title: "Shree Hanuman Chalisa", artist: "Hariharan", img: "https://i.scdn.co/image/ab67616d00001e026d9a2050e82ce05424dca5aa"},
    {src: "songs/Apt.mp3", title: "APT", artist: "ROSE,Bruno Mars", img: "https://i.scdn.co/image/ab67616d00001e0236032cb4acd9df050bc2e197"},
    {src: "songs/Dietmountaindew.mp3", title: "Diet Mountain Dew", artist: "Lana Del Rey", img: "https://i.scdn.co/image/ab67616d00001e02ebc8cfac8b586bc475b04918"},
    {src: "songs/BrunoMars-TheLazySong.mp3", title: "The Lazy Song", artist: "Bruno Mars", img: "https://i.scdn.co/image/ab67616d00001e02f6b55ca93bd33211227b502b"},
    {src: "songs/luther(with sza).mp3", title: "luther(with sza)", artist: "Kendrick Lamar,SZA", img: "https://i.scdn.co/image/ab67616d00001e02d9985092cd88bffd97653b58"}
  ];
  
  // Combine all playlist songs
  const playlistSongs = [];
  Object.values(playlists).forEach(playlist => {
    playlistSongs.push(...playlist);
  });
  
  // Combine original and playlist songs
  const allSongs = [...originalSongs, ...playlistSongs];
  
  // Remove duplicates based on title
  const uniqueSongs = allSongs.filter((song, index, self) => 
    index === self.findIndex(s => s.title === song.title)
  );
  
  cardContainer.innerHTML = uniqueSongs.map(song => `
    <div class="card">
      <img src="${song.img}" alt="${song.title}" class="spotify-img" 
           data-songs="${song.src}" data-title="${song.title}" data-artist="${song.artist}" />
      <h2>${song.title}</h2>
      <p>${song.artist}</p>
      <div class="play">
        <img src="playB.png" alt="play" />
      </div>
    </div>
  `).join('');
  
  setupImageClickHandlers();
}

function showSearchInterface() {
  document.getElementById('playlistTitle').textContent = 'Search';
  const cardContainer = document.querySelector('.cardContainer');
  
  cardContainer.innerHTML = `
    <div style="width: 100%; padding: 20px;">
      <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px; max-width: 800px; margin-left: auto; margin-right: auto;">
        <input type="text" id="searchInput" placeholder="Search for songs, artists, or playlists..." 
               style="flex: 1; padding: 20px 25px; border-radius: 30px; border: none; background: #282828; color: white; font-size: 20px; height: 60px; box-sizing: border-box; min-width: 500px;" />
        <button id="searchButton" style="padding: 20px 30px; border-radius: 30px; border: none; color: white; cursor: pointer; font-size: 18px; font-weight: bold; height: 60px; min-width: 120px;">Search</button>
      </div>
      <div id="searchResults"></div>
    </div>
  `;
  
  document.getElementById('searchButton').addEventListener('click', performSearch);
  document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
  });
}

function performSearch() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const resultsDiv = document.getElementById('searchResults');
  
  if (!query) {
    resultsDiv.innerHTML = '<p style="color: #b3b3b3;">Please enter a search term</p>';
    return;
  }
  
  // Search through all playlists
  let results = [];
  Object.keys(playlists).forEach(playlistName => {
    playlists[playlistName].forEach(song => {
      if (song.title.toLowerCase().includes(query) || song.artist.toLowerCase().includes(query)) {
        results.push({...song, playlist: playlistName});
      }
    });
  });
  
  if (results.length === 0) {
    resultsDiv.innerHTML = '<p style="color: #b3b3b3;">No results found</p>';
  } else {
    resultsDiv.innerHTML = results.map(song => `
      <div style="display: flex; align-items: center; padding: 10px; background: #282828; margin: 5px 0; border-radius: 8px; cursor: pointer;" 
           onclick="playSearchResult('${song.src}', '${song.title}', '${song.artist}')">
        <div style="width: 50px; height: 50px; background: #1DB954; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
          <span style="color: white; font-weight: bold;">${song.title.substring(0,2)}</span>
        </div>
        <div>
          <div style="color: white; font-weight: bold;">${song.title}</div>
          <div style="color: #b3b3b3; font-size: 14px;">${song.artist} • ${song.playlist}</div>
        </div>
      </div>
    `).join('');
  }
}

function playSearchResult(src, title, artist) {
  playMusic(encodeURI(src), title, artist);
}

function showSignupForm() {
  const modal = document.createElement('div');
  modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000;';
  
  modal.innerHTML = `
    <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); padding: 30px; border-radius: 16px; width: 400px; max-width: 90%; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);">
      <h2 style="color: white; margin-bottom: 20px; text-align: center;">Sign up for Previa</h2>
      <input type="email" placeholder="Email" style="width: 100%; padding: 12px; margin: 10px 0; border: none; border-radius: 12px; background: rgba(255, 255, 255, 0.1); color: white; backdrop-filter: blur(10px); box-sizing: border-box;" />
      <input type="password" placeholder="Password" style="width: 100%; padding: 12px; margin: 10px 0; border: none; border-radius: 12px; background: rgba(255, 255, 255, 0.1); color: white; backdrop-filter: blur(10px); box-sizing: border-box;" />
      <input type="text" placeholder="Display Name" style="width: 100%; padding: 12px; margin: 10px 0; border: none; border-radius: 12px; background: rgba(255, 255, 255, 0.1); color: white; backdrop-filter: blur(10px); box-sizing: border-box;" />
      <button onclick="alert('Signup successful!'); this.parentElement.parentElement.remove();" style="width: 100%; padding: 12px; margin: 20px 0 10px; border: none; border-radius: 25px; background: rgba(139, 69, 255, 0.8); color: white; font-weight: bold; cursor: pointer;">Sign Up</button>
      <button onclick="this.parentElement.parentElement.remove();" style="width: 100%; padding: 8px; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 25px; background: transparent; color: white; cursor: pointer;">Cancel</button>
    </div>
  `;
  
  document.body.appendChild(modal);
}

function showLoginForm() {
  const modal = document.createElement('div');
  modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center; z-index: 1000;';
  
  modal.innerHTML = `
    <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.2); padding: 30px; border-radius: 16px; width: 400px; max-width: 90%; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);">
      <h2 style="color: white; margin-bottom: 20px; text-align: center;">Log in to Previa</h2>
      <input type="email" placeholder="Email or username" style="width: 100%; padding: 12px; margin: 10px 0; border: none; border-radius: 12px; background: rgba(255, 255, 255, 0.1); color: white; backdrop-filter: blur(10px); box-sizing: border-box;" />
      <input type="password" placeholder="Password" style="width: 100%; padding: 12px; margin: 10px 0; border: none; border-radius: 12px; background: rgba(255, 255, 255, 0.1); color: white; backdrop-filter: blur(10px); box-sizing: border-box;" />
      <button onclick="alert('Login successful!'); this.parentElement.parentElement.remove();" style="width: 100%; padding: 12px; margin: 20px 0 10px; border: none; border-radius: 25px; background: white; color: black; font-weight: bold; cursor: pointer;">Log In</button>
      <button onclick="this.parentElement.parentElement.remove();" style="width: 100%; padding: 8px; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 25px; background: transparent; color: white; cursor: pointer;">Cancel</button>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Navigation functions
function addToHistory(page) {
  if (currentHistoryIndex < navigationHistory.length - 1) {
    navigationHistory = navigationHistory.slice(0, currentHistoryIndex + 1);
  }
  navigationHistory.push(page);
  currentHistoryIndex++;
  updateNavigationButtons();
}

function updateNavigationButtons() {
  const backBtn = document.getElementById('backBtn');
  const forwardBtn = document.getElementById('forwardBtn');
  
  if (backBtn && forwardBtn) {
    backBtn.style.opacity = currentHistoryIndex > 0 ? '1' : '0.5';
    forwardBtn.style.opacity = currentHistoryIndex < navigationHistory.length - 1 ? '1' : '0.5';
  }
}

// Back button functionality
function initializeNavigation() {
  const backBtn = document.getElementById('backBtn');
  const forwardBtn = document.getElementById('forwardBtn');
  
  if (backBtn && forwardBtn) {
    backBtn.addEventListener('click', () => {
      if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        const previousPage = navigationHistory[currentHistoryIndex];
        navigateToPage(previousPage, false);
        updateNavigationButtons();
      }
    });

    forwardBtn.addEventListener('click', () => {
      if (currentHistoryIndex < navigationHistory.length - 1) {
        currentHistoryIndex++;
        const nextPage = navigationHistory[currentHistoryIndex];
        navigateToPage(nextPage, false);
        updateNavigationButtons();
      }
    });
    
    // Initialize navigation history
    addToHistory({type: 'home'});
    updateNavigationButtons();
  }
}

function navigateToPage(page, addHistory = true) {
  if (addHistory) addToHistory(page);
  
  switch(page.type) {
    case 'home':
      loadHomePage();
      break;
    case 'search':
      showSearchInterface();
      break;
    case 'playlist':
      loadPlaylist(page.name);
      break;
  }
}
main();

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', initializeNavigation);

// Also try to initialize immediately in case DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeNavigation);
} else {
  initializeNavigation();
}

// Footer links functionality
document.querySelectorAll('.link a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const linkText = e.target.textContent.trim();
    alert(`${linkText} page - This would redirect to ${linkText.toLowerCase().replace(/\s+/g, '-')} page`);
  });
});