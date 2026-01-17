const timeago = (date) => {
  const now = new Date();
  const secondsPast = (now.getTime() - new Date(date).getTime()) / 1000;
  if (secondsPast < 60) {
    return `${parseInt(secondsPast)}s ago`;
  }
  if (secondsPast < 3600) {
    return `${parseInt(secondsPast / 60)}m ago`;
  }
  if (secondsPast <= 86400) {
    return `${parseInt(secondsPast / 3600)}h ago`;
  }
  if (secondsPast > 86400) {
    const day = new Date(date).getDate();
    const month = new Date(date).toLocaleString("default", { month: "short" });
    const year =
      new Date(date).getFullYear() === now.getFullYear()
        ? ""
        : ` ${new Date(date).getFullYear()}`;
    return `${day} ${month}${year}`;
  }
};

const formatHumanNumber = (value) => {
  if (value < 1000) return value.toString();

  const units = ["", "K", "M", "B", "T", "Q", "Qi", "Sx", "Sp", "Oc", "No"];

  let unitIndex = 0;
  let num = value;

  while (num >= 1000 && unitIndex < units.length - 1) {
    num /= 1000;
    unitIndex++;
  }

  return `${num.toFixed(num < 10 ? 1 : 0)}${units[unitIndex]}`;
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
  const theme = localStorage.getItem("theme") || "dark";
  const isDark = theme === "dark";

  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  updateThemeIcons(isDark);
  document
    .querySelector(".theme-toggle")
    .addEventListener("click", toggleTheme);

  const thisYearSpans = document.querySelectorAll(".this-year");
  if (thisYearSpans) {
    const currentYear = new Date().getFullYear();
    thisYearSpans.forEach((span) => {
      span.textContent = currentYear;
    });
  }
});
