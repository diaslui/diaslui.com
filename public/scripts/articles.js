const eRefs = {
  articlesPinned: ".articles-pinned",
  articlesResults: ".articles-results",
  articlesLoadMoreBtn: ".articles-load-more",
  articlesDisplayCount: ".articles-display-count",
  articlesSearch: ".articles-search",
  articlesPinnedSection: ".articles-pinned-section",
  articlesEmptyDisplay: ".articles-empty-display",
};

const domRefs = {};
let articlesData = [];
const paginationPage = 0;

const loadElements = async () => {
  for (const [key, selector] of Object.entries(eRefs)) {
    domRefs[key] = document.querySelector(selector);
    if (!domRefs[key]) {
      console.warn(`element for ${key} not found.`);
    }
  }
};

const loadArticles = async () => {
  const res = await fetch(
    "https://raw.githubusercontent.com/luiisp/blog-storage-diaslui.com/refs/heads/master/posts/index.json",
  ).catch(() => {
    console.error("error on fetch articles");
    return;
  });
  const data = await res.json().catch(() => {
    console.error("error on get json");
    return;
  });

  articlesData = data;
};

const updateDisplayCount = (val) => {
  domRefs.articlesDisplayCount.innerText = val;
};

const showArticlesContainer = (articles, container) => {
  container.innerHTML = "";

  articles.forEach((article) => {
    const articleImage =
      "https://raw.githubusercontent.com/luiisp/blog-storage-diaslui.com/refs/heads/master" +
      article.image;
    const a = document.createElement("a");
    a.href = `/read/${article.filename.split(".md")[0]}`;
    a.classList =
      "ost-card bg-white dark:bg-subgdark border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary-500/50 transition-all duration-300 group";

    a.innerHTML = `
    
    <div class="flex flex-col sm:flex-row">
            <div class="sm:w-64 lg:w-80 flex-shrink-0">
              <img src="${articleImage}" alt="Docker" class="w-full h-48 sm:h-full object-cover transition-transform duration-500">
            </div>
            <div class="flex-1 p-4 sm:p-6 flex flex-col">
              <div class="flex flex-wrap gap-2 mb-3">
                <span class="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-medium rounded-full">Article</span>
              </div>
              <h3 class="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                ${article.title}
              </h3>
              <p class="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 sm:line-clamp-3 mb-4 flex-1">
                ${article.description}
              </p>
              <div class="flex items-center justify-between mt-auto">
                <div class="flex items-center gap-3">
                  <img src="/assets/img/pictures/thc.jpg" alt="Luis" class="w-8 h-8 rounded-full">
                  <div>
                    <p class="text-sm font-medium">Luis Dias</p>
                    <p class="text-xs text-slate-500">${article.date}</p>
                  </div>
                </div>
                 <div class="flex items-center gap-1">
                        <img src="/assets/img/full-diaslui.png" alt="Diaslui Logo"
            class="w-6 h-6 flex items-center justify-center text-lg"></img>
              </div>
              </div>
            </div>
          </div>
    
    `;

    container.appendChild(a);
  });
};

const displayArticles = async () => {
  const selectedArticles = articlesData.slice(0, paginationPage + 6);
  if (selectedArticles.length >= articlesData.length) {
    domRefs.articlesLoadMoreBtn.style.display = "none";
  } else {
    domRefs.articlesLoadMoreBtn.style.display = "";
  }

  updateDisplayCount(selectedArticles.length);
  console.log(selectedArticles);
  showArticlesContainer(selectedArticles, domRefs.articlesResults);
};

const showArticlesContainerPinned = (articles, container) => {
  container.innerHTML = "";

  articles.forEach((article) => {
    const articleImage =
      "https://raw.githubusercontent.com/luiisp/blog-storage-diaslui.com/refs/heads/master" +
      article.image;

    const a = document.createElement("a");
    a.href = `/read/${article.filename.split(".md")[0]}`;
    a.classList =
      "post-card pinned-glow bg-white dark:bg-subgdark border-2 border-primary-500/50 dark:border-primary-500/30 rounded-2xl overflow-hidden transition-all duration-300 group";
    a.innerHTML = `
    
    <div class="relative">
            <img src="${articleImage}" alt="Carreira" class="w-full h-40 sm:h-48 object-cover transition-transform duration-500">
            <div class="absolute top-3 left-3 flex gap-2">
              <span class="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"/>
                </svg>
                Fixed Article
              </span>
            </div>
          </div>
          <div class="p-4 sm:p-6">
            <div class="flex flex-wrap gap-2 mb-3">
              <span class="px-2 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 text-xs font-medium rounded-full">Pinned Article</span>
                 <span class="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-medium rounded-full">Important</span>
              </div>
            <h3 class="text-lg sm:text-xl font-bold mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              ${article.title}
            </h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                ${article.description}
            </p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500">
                <span>${article.date}</span>
              </div>
              <div class="flex items-center gap-1">
                        <img src="/assets/img/full-diaslui.png" alt="Diaslui Logo"
            class="w-6 h-6 flex items-center justify-center text-lg"></img>
              </div>
            </div>
            
          </div>
    
    
    `;

    container.appendChild(a);
  });
};

const displayPinnedArticles = async () => {
  const pinnedArticles = articlesData.filter(
    (article) => article.pinned === true,
  );
  if (pinnedArticles.length === 0) {
    domRefs.articlesPinnedSection.style.display = "none";
    return;
  }

  showArticlesContainerPinned(pinnedArticles, domRefs.articlesPinned);
};

const emptyArticlesDisplay = (empty) => {
  if (empty) {
    domRefs.articlesEmptyDisplay.classList.remove("hidden");
  } else {
    domRefs.articlesEmptyDisplay.classList.add("hidden");
  }
};

const inputSearch = (e) => {
  const val = domRefs.articlesSearch.value;
  if (val.length >= 1) {
    domRefs.articlesPinnedSection.style.display = "none";
  } else {
    if (articlesData.filter((article) => article.pinned === true).length === 0) {
      domRefs.articlesPinnedSection.style.display = "none";
    } else {
      domRefs.articlesPinnedSection.style.display = "";
    }
  }
  const filteredArticles = articlesData.filter((article) => {
    return article.title.toLowerCase().includes(val.toLowerCase());
  });

  if (filteredArticles.length === 0) {
    emptyArticlesDisplay(true);
  } else {
    emptyArticlesDisplay(false);
  }

  updateDisplayCount(filteredArticles.length);
  showArticlesContainer(filteredArticles, domRefs.articlesResults);
};

const includeListeners = async () => {
  domRefs.articlesSearch.addEventListener("input", inputSearch);
  domRefs.articlesLoadMoreBtn.addEventListener("click", () => {
    paginationPage += 6;
    displayArticles();
  });
};

const initArticles = async () => {
  await loadElements();
  await loadArticles();
  await includeListeners();

  displayArticles();
  displayPinnedArticles();
};

document.addEventListener("DOMContentLoaded", initArticles);
