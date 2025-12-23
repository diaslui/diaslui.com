let sseInstance = null;
let nextCursor = null;
const domRefs = {};
const eRefs = {
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

  feedDiv: "#feed",
  loadingPostsIndicator: "#loadind-posts-indicator",
};

const refElements = () => {
  for (const [key, selector] of Object.entries(eRefs)) {
    domRefs[key] = document.querySelector(selector);
  }
};

const loadingPosts = (loading) => {
  if (loading) {
    domRefs.loadingPostsIndicator.style.display = "flex";
  } else {
    domRefs.loadingPostsIndicator.style.display = "none";
  }
};

const redableOldDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "1 day ago";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  }
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? "1 month ago" : `${months} months ago`;
  }
  const years = Math.floor(diffInDays / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
};

const createPostHtmlScheme = (data) => {
  const postDiv = document.createElement("div");
  postDiv.classList.add("space-y-4", "sm:space-y-6");
  postDiv.innerHTML = `
            <article
              class="bg-subglight dark:bg-subgdark border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
              <img src="${data.imgSrc || "/assets/img/ogbanner.jpg"}" alt="Post Image"
                class="w-full h-48 sm:h-56 object-cover">
              <div class="p-4 sm:p-6">
                <div class="flex items-start gap-3 sm:gap-4 mb-4">
                  <img src=""
                    class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center text-lg sm:text-xl flex-shrink-0"></img>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-base sm:text-lg mb-1">Luis Dias</h3>
                    <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400"> Published ${redableOldDate(data.createdAt)} </p>
                  </div>
                </div>

                <h2
                  class="text-lg sm:text-xl font-bold mb-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors cursor-pointer">
                  ${data.title}
                </h2>

                <p class="text-slate-600 dark:text-slate-400 mb-4 text-sm sm:text-base line-clamp-2 sm:line-clamp-3">
                  ${data.description || " "}
                </p>

                <div class="flex flex-wrap gap-2 mb-4">
                  <span
                    class="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">Lorem</span>
                  <span
                    class="px-2 sm:px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-medium">Lorem</span>
                </div>

                <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2">
                      <button id="up-1"
                        class="vote-btn p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7">
                          </path>
                        </svg>
                      </button>
                      <span id="count-1" class="font-semibold text-sm sm:text-base">89</span>
                      <button id="down-1"
                        class="vote-btn p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7">
                          </path>
                        </svg>
                      </button>
                    </div>

                    <button
                      class="flex items-center gap-1.5 sm:gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm sm:text-base">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                        </path>
                      </svg>
                      <span class="hidden sm:inline">15</span>
                    </button>
                  </div>

                  <a href="#"
                    class="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold transition-colors text-sm sm:text-base">
                    Read Full Article
                  </a>
                </div>
              </div>
            </article>



  `;

  return postDiv;
};

const getPosts = async () => {
  loadingPosts(true);
  try {
    const response = await fetch(
      `/api/posts?limit=8&cursor=${nextCursor || ""}`
    );
    const data = await response.json();

    console.log(data);
    if (response.ok) {
      nextCursor = data.nextCursor;
      return data.data;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Err:", error);

    return undefined;
  } finally {
    loadingPosts(false);
  }
};

const postWorks = async () => {
  const data = await getPosts();
  console.log("posts data:", data);
  if (!data || data.length === 0) {
    console.log("no posts found");
    domRefs.feedDiv.innerHTML = "No posts found.";
    return;
  }

  // error fix

  data.forEach((post) => {
    console.log(post);
    const postHtml = createPostHtmlScheme(post);
    console.log(postHtml);
    domRefs.feedDiv.appendChild(postHtml);
  });
};

const updateMusicInfo = (data) => {
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
  if (sseInstance) return;
  sseInstance = new EventSource("/lastfm/sse");

  sseInstance.onmessage = (event) => {
    const data = JSON.parse(event.data);
    updateMusicInfo(data);
  };

  sseInstance.onerror = (error) => {
    console.error("SSE err:", error);
    sseInstance.close();
    sseInstance = null;
    setTimeout(sse, 10000);
  };
};

const init = () => {
  postWorks();

  sse();
};

window.addEventListener("DOMContentLoaded", () => {
  refElements();
  init();
});
