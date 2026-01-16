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
}

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

const renderArticle = (md) => {
  const container = document.getElementById("articleContent");

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

  container.innerHTML = marked.parse(md);

  container.querySelectorAll("pre").forEach((pre) => {
    pre.style.position = "relative";
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.innerHTML =
      '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>';
    btn.onclick = () => copyCode(pre, btn);
    pre.appendChild(btn);
  });
};

const updatePost = (md, meta) => {
  domUpdateAllText(".article-title", meta.title);
  domUpdateAllText(".article-date", timeago(meta.date));
  domUpdateAllText(".article-author", meta.author || "Diaslui");
  domUpdateAllText(".article-reading-time", meta.readingTime || "5 min read");

  renderArticle(md);
  generateTOC();
};

const parseMarkdown = (md) => {
  if (!md.startsWith("---")) {
    return { meta: {}, content: md };
  }

  const end = md.indexOf("\n---", 3);
  if (end === -1) {
    return { meta: {}, content: md };
  }

  const rawMeta = md.slice(3, end).trim();
  const content = md.slice(end + 4).trim();

  const meta = {};

  rawMeta.split("\n").forEach((line) => {
    if (!line.includes(":")) return;

    const idx = line.indexOf(":");
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (value === "true") value = true;
    if (value === "false") value = false;

    meta[key] = value;
  });

  return { meta, content };
};

const getMarkdownBody = (md) => {
  const parts = md.split("---");

  if (parts.length < 3) {
    return md;
  }

  return parts.slice(2).join("---").trim();
};

const getPost = async (filename) => {
  const url = `https://raw.githubusercontent.com/luiisp/blog-storage-diaslui.com/refs/heads/master/posts/${encodeURIComponent(
    filename
  )}.md`;

  const res = await fetch(url);
  if (!res.ok) return;

  const md = await res.text();
  const post = parseMarkdown(md);

  updatePost(getMarkdownBody(md), post.meta);
};

const initRead = () => {};

document.addEventListener("DOMContentLoaded", initRead);
window.addEventListener("scroll", updateReadingProgress);
