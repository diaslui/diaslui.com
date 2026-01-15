const loadYoutubeVideos = async () => {
  const container = document.getElementById("yt-videos-div");
  if (!container) return;

  try {
    const res = await fetch("/api/youtube/lastvideos");
    const data = await res.json();

    if (!data.videos || !Array.isArray(data.videos)) return;

    data.videos.forEach((video) => {
      const videoId = video.id.videoId;
      const title = video.snippet.title;
      const channel = video.snippet.channelTitle;
      const description =
        video.snippet.description.substring(0, 33) +
        (video.snippet.description.length > 33 ? "..." : "");
      const thumb =
        video.snippet.thumbnails.high?.url ||
        video.snippet.thumbnails.medium?.url;

      const a = document.createElement("a");
      a.href = `https://www.youtube.com/watch?v=${videoId}`;
      a.target = "_blank";
      a.rel = "noopener";
      a.className =
        "group bg-subglight dark:bg-subgdark border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover-lift sm:col-span-2 lg:col-span-1";

      a.innerHTML = `
        <div class="relative aspect-video">
          <img 
            src="${thumb}" 
            alt="${title}" 
            loading="lazy"
            class="w-full h-full object-cover"
          >
          <div class="absolute inset-0 video-overlay"></div>

          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="w-14 h-14 bg-accent-500 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="p-4">
          <h3 class="font-semibold line-clamp-2 group-hover:text-accent-500 dark:group-hover:text-accent-500 transition-colors">
            ${title}
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">
            ${description}
          </p>
        </div>
      `;

      container.appendChild(a);
    });
  } catch (err) {
    console.error(err);
  }
};

const homeInit = () => {
  loadYoutubeVideos();
};

document.addEventListener("DOMContentLoaded", homeInit);
