
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
  const theme = localStorage.getItem("theme") || "dark";
  const isDark = theme === "dark";

  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  updateThemeIcons(isDark);
  document.querySelector(".theme-toggle").addEventListener("click", toggleTheme);
});
