const calculatePorcent = (value, goal) => {
  if (goal === 0) return 0;
  return Math.min((value / goal) * 100, 100);
};

const loadStats = async () => {
  try {
    const res = await fetch("/stats");
    const data = await res.json();

    const total = Number(data.totalRequests ?? 0);

    const formatted = formatHumanNumber(total);
    const goal = calculateNextGoal(total);

    const totalRequestsElements = document.querySelectorAll(".total-requests");
    totalRequestsElements.forEach((el) => {
      el.innerText = formatted;
    });

    const porcent = calculatePorcent(total, goal);
    const porcentElements = document.querySelectorAll(".porcent-total-stats");
    porcentElements.forEach((el) => {
      el.style.width = "0%";

      const duration = 800;
      const start = performance.now();
      const from = 0;
      const to = Number(porcent);

      const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        const current = from + (to - from) * eased;
        el.style.width = `${current.toFixed(2)}%`;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.style.width = `${to}%`;
        }
      };

      requestAnimationFrame(step);
    });
  } catch (err) {
    console.error("Failed to load stats", err);
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

const calculateNextGoal = (value) => {
  if (value < 100) return 100;

  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));

  return magnitude * 10;
};

document.addEventListener("DOMContentLoaded", loadStats);
