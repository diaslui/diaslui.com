const socialUrls = [
  {
    name: "instagram",
    url: "https://www.instagram.com/diasluii/",
    openInNewTab: true,
  },
  {
    name: "linkedin",
    url: "https://www.linkedin.com/in/diaslui/",
    openInNewTab: true,
  },
  {
    name: "twitter",
    url: "https://twitter.com/diasluii",
    openInNewTab: true,
  },
  {
    name: "mail",
    url: "mailto:diasluii@example.com",
    openInNewTab: true,
  },
  {
    name: "github",
    url: "https://github.com/diaslui",
    openInNewTab: true,
  },
  {
    name: "youtube",
    url: "https://www.youtube.com/@diaslui",
    openInNewTab: true,
  },
  {
    name: "coffe",
    url: "https://www.buymeacoffee.com/diaslui",
    openInNewTab: true,
  },
  {
    name: "blog",
    url: "https://diaslui.com/articles",
    openInNewTab: false,
  },
  {
    name: "thisGithubRepo",
    url: "https://github.com/diaslui/diaslui.com",
    openInNewTab: true,
  },
];

const replaceSocial = () => {
  socialUrls.forEach((social) => {
    const domSocialARefs = document.querySelectorAll(`.social-${social.name}`);
    domSocialARefs.forEach((domSocialRef) => {
      domSocialRef.setAttribute("href", social.url);
      if (social.openInNewTab) {
        domSocialRef.setAttribute("target", "_blank");
        domSocialRef.setAttribute("rel", "noopener noreferrer");
      }
    });
  });
};

const initLinktree = () => {
  replaceSocial();
};

window.addEventListener("DOMContentLoaded", initLinktree);
