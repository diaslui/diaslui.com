const domUpdateAllText = (querySelector, value) => {
  document.querySelectorAll(querySelector).forEach((el) => {
    el.innerText = value;
  });
};

const updateReadingProgress = () => {
  const article = document.querySelector("article");
  const header = document.querySelector("header");

  const articleTop = article.offsetTop;
  const articleHeight = article.offsetHeight;
  const windowHeight = window.innerHeight;
  const scrollY = window.scrollY;

  const start = articleTop - windowHeight;
  const end = articleTop + articleHeight - windowHeight;

  let percentage = ((scrollY - start) / (end - start)) * 100;
  percentage = Math.max(0, Math.min(100, percentage));

  header.style.setProperty("--header-progress", `${percentage}%`);
  header.style.setProperty("--width-progress", `2.5px`);
};

const generateTOC = () => {
  const content = document.getElementById("articleContent");
  const toc = document.getElementById("tableOfContents");
  const headings = content.querySelectorAll("h2, h3");

  toc.innerHTML = "";

  headings.forEach((heading, index) => {
    const id = `heading-${index}`;
    heading.id = id;

    const link = document.createElement("a");
    link.href = `#${id}`;
    link.className = `toc-link block py-1.5 pl-3 border-l-2 border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors ${
      heading.tagName === "H3"
        ? "ml-4 text-slate-500 dark:text-slate-500"
        : "text-slate-700 dark:text-slate-300"
    }`;
    link.textContent = heading.textContent;
    link.onclick = (e) => {
      e.preventDefault();
      heading.scrollIntoView({ behavior: "smooth" });
    };

    toc.appendChild(link);
  });
};

const renderArticle = () => {
  const container = document.getElementById("articleContent");
  const body = JSON.parse(
    document.getElementById("articleContent").textContent
  );

  marked.setOptions({
    highlight: function (code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      return hljs.highlightAuto(code).value;
    },
    breaks: true,
    gfm: true,
  });

  container.innerHTML = marked.parse(body);

  container.querySelectorAll("pre").forEach((pre) => {
    pre.style.position = "relative";
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.innerHTML =
      '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>';
    btn.onclick = () => copyCode(pre, btn);
    pre.appendChild(btn);
  });

  generateTOC();
};

const estimateReadingTime = (text) => {
  const wordsPerMinute = 260;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

const getViewsCount = async (postId) => {
  try {
    const res = await fetch(`/api/stats/read:${postId}`);
    const data = await res.json();
    return Number(data.totalRequests ?? 0);
  } catch (err) {
    console.error("Failed to load views count", err);
    return 0;
  }
};

const updatePostMeta = (header) => {
  domUpdateAllText(".article-date", timeago(header.date));
  domUpdateAllText(
    ".article-reading-time",
    estimateReadingTime(document.getElementById("articleContent").textContent)
  );

  getViewsCount(header.filename.split(".")[0]).then((views) => {
    document.querySelector(".article-views-parent").classList.remove("opacity-0");
    domUpdateAllText(".article-views", `${formatHumanNumber(views)} views`);
  });
};

const initRead = () => {};

document.addEventListener("DOMContentLoaded", initRead);
window.addEventListener("scroll", updateReadingProgress);
