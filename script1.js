console.log("Let's start JavaScript!");

let currentAudio = null;
let songs = [];

function secondsToMinutesSeconds(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// ===== Updated mobile-friendly playMusic function =====
function playMusic(src, title = "", artist = "", imgSrc = "") {
  currentAudio?.pause();
  currentAudio = new Audio(src);

  // Mobile compatibility
  currentAudio.preload = 'auto';
  currentAudio.load();

  // Ensure timeupdate updates only when duration is available
  currentAudio.addEventListener("timeupdate", () => {
    const duration = currentAudio.duration || 0;
    const currentTime = currentAudio.currentTime || 0;
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentTime)}/${secondsToMinutesSeconds(duration)}`;
    document.querySelector(".circle").style.left = duration ? (currentTime / duration) * 100 + "%" : "0%";
  });

  // Seekbar support with touch
  const seekbar = document.querySelector(".seekbar");
  const handleSeek = (e) => {
    const rect = e.target.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    let percent = ((clientX - rect.left) / rect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));
    document.querySelector(".circle").style.left = percent + "%";
    if (currentAudio.duration) currentAudio.currentTime = (currentAudio.duration * percent) / 100;
  };

  seekbar.addEventListener("click", handleSeek);
  seekbar.addEventListener("touchstart", handleSeek);

  // Play with mobile-friendly error handling
  const playPromise = currentAudio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      document.getElementById("play").src = "pause.svg";
    }).catch(error => {
      console.log("Playback failed:", error);
      document.getElementById("play").src = "play.svg";
    });
  }

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
// =======================================================

async function getSongs() {
  let res = await fetch("http://127.0.0.1:3000/songs/");
  let text = await res.text();
  let div = document.createElement("div");
  div.innerHTML = text;

  return [...div.getElementsByTagName("a")]
    .map((a) => a.href)
    .filter((href) => href.endsWith(".mp3"));
}

function setupImageClickHandlers() {
  document.querySelectorAll(".spotify-img").forEach((img, index) => {
    const handleClick = () => {
      const song = img.dataset.songs;
      const title = img.dataset.title;
      const artist = img.dataset.artist;
      const imgSrc = img.src;

      if (!song) return;

      const src = "http://127.0.0.1:3000/" + encodeURI(song);
      
      // Set current song index for navigation
      currentSongIndex = index;
      if (!allSongs.length) allSongs = getAllSongs();

      if (currentAudio?.src === src) {
        if (currentAudio.paused) {
          currentAudio.play().then(() => {
            document.getElementById("play").src = "pause.svg";
          }).catch(console.error);
        } else {
          currentAudio.pause();
          document.getElementById("play").src = "play.svg";
        }
        return;
      } else {
        playMusic(src, title, artist, imgSrc);
      }
    };
    
    // Add both click and touch events for mobile
    img.addEventListener('click', handleClick);
    img.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleClick();
    });
  });
}

// The rest of your code remains exactly the same as provided
// Including main(), navigation, playlists, search, login/signup, volume, next/prev buttons, etc.

async function main() {
  songs = await getSongs();
  console.log("Songs from server:", songs);
}

setupImageClickHandlers();

const playBtn = document.getElementById("play");
const handlePlayPause = () => {
  if (currentAudio) {
    if (currentAudio.paused) {
      currentAudio.play().then(() => {
        playBtn.src = "pause.svg";
      }).catch(error => {
        console.log("Play failed:", error);
        playBtn.src = "play.svg";
      });
    } else {
      currentAudio.pause();
      playBtn.src = "play.svg";
    }
  }
};

playBtn.addEventListener("click", handlePlayPause);
playBtn.addEventListener("touchend", (e) => {
  e.preventDefault();
  handlePlayPause();
});

let currentSongIndex = 0;
let allSongs = [];
let navigationHistory = [];
let currentHistoryIndex = -1;

// Functions for navigation, playlists, search, signup/login, etc. remain unchanged

main();
