const domRefs = {};
const eRefs = {
  themeToggle: ".theme-toggle",
  listenMusicDiv: ".listen-music",
  listenMusicSongName: ".listen-music-song-name",
  listenMusicArtist: ".listen-music-artist",
  listenMusicPlatform: ".listen-music-platform",
  listenMusicAlbumCover: ".listen-music-album-cover",

  mobileMusicDiv: ".mobile-music",
  mobileMusicSongName: ".mobile-music-song-name",
  mobileMusicArtist: ".mobile-music-artist",
  mobileMusicPlatform: ".mobile-music-platform",
  mobileMusicAlbumCover: ".mobile-music-album-cover",
};

const refElements = () => {
  for (const [key, selector] of Object.entries(eRefs)) {
    domRefs[key] = document.querySelector(selector);
  }
};

const updateMusicInfo = (data) => {

  console.log("Updating music info:", data);

  if (!data.playing) {
    domRefs.listenMusicDiv.style.display = "none";
    domRefs.mobileMusicDiv.style.display = "none";
    return;
  }

  domRefs.listenMusicSongName.textContent = data.trackName;
  domRefs.listenMusicArtist.textContent = data.artist;
  domRefs.listenMusicPlatform.textContent = data.platform;
  domRefs.listenMusicAlbumCover.src = data.albumCover;

  domRefs.mobileMusicSongName.textContent = data.trackName;
  domRefs.mobileMusicArtist.textContent = data.artist;
  domRefs.mobileMusicPlatform.textContent = data.platform;
  domRefs.mobileMusicAlbumCover.src = data.albumCover;

  domRefs.listenMusicDiv.style.display = "block";
  domRefs.mobileMusicDiv.style.display = "flex";
};


const sse = () => {
  const eventSource = new EventSource("/lastfm/sse");

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("SSE data:", data);
    updateMusicInfo(data);
  };

  eventSource.onerror = (error) => {
    console.error("SSE err:", error);
    eventSource.close();
    setTimeout(sse, 10000);
  };
};

const init = () => {
  sse();

  domRefs.themeToggle.addEventListener("click", toggleTheme);
};

const toggleTheme = () => {
  document.documentElement.classList.toggle("dark");
  const isDark = document.documentElement.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  updateThemeIcons(isDark);
};

const updateThemeIcons = (isDark) => {
  document.getElementById("sunIcon").classList.toggle("hidden", isDark);
  document.getElementById("moonIcon").classList.toggle("hidden", !isDark);
};

window.addEventListener("DOMContentLoaded", () => {
  refElements();
  const theme = localStorage.getItem("theme") || "dark";
  const isDark = theme === "dark";

  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  updateThemeIcons(isDark);
  init();
});
