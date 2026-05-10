document.addEventListener("DOMContentLoaded", () => {
  const problemsContainer = document.getElementById("problems-container");
  const searchInput = document.getElementById("search-input");
  const loading = document.getElementById("loading");

  let problems = [];

  const fetchProblems = async () => {
    try {
      const response = await fetch("/api/solutions");
      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }
      problems = await response.json();
      displayProblems(problems);
    } catch (error) {
      console.error(error);
      loading.innerHTML = `<p class="text-red-500">Failed to load problems. Please try again later.</p>`;
    } finally {
      loading.style.display = "none";
    }
  };

  const displayProblems = (problemsToDisplay) => {
    problemsContainer.innerHTML = "";
    if (problemsToDisplay.length === 0) {
      problemsContainer.innerHTML = `<p class="col-span-full text-center">No problems found.</p>`;
      return;
    }
    problemsToDisplay.forEach((problem) => {
      const problemElement = document.createElement("div");
      problemElement.className =
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-amber-500/50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-amber-500/50";
      problemElement.innerHTML = `
        <a href="/problems/${problem.name}" class="absolute inset-0 z-10 block"></a>
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-xl font-bold text-zinc-900 transition-colors group-hover:text-amber-600 dark:text-zinc-50 dark:group-hover:text-amber-400">${problem.name}</h3>
          </div>
          <div class="flex h-10 w-max px-2 shrink-0 items-center justify-center">
            <img src="assets/img/codeforces-logo.png" alt="Codeforces Logo" class="h-6 w-full">
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm font-medium text-amber-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-amber-400">
          View solution &rarr;
        </div>
      `;
      problemsContainer.appendChild(problemElement);
    });
  };

  const fetchSolutionCode = async (url) => {
    const response = await fetch(url);
    return await response.text();
  }

  const showSolutionModal = (code) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
    modal.innerHTML = `
        <div class="w-11/12 max-w-4xl rounded-lg bg-white p-6 dark:bg-zinc-900">
            <h2 class="mb-4 text-2xl font-bold">Solution</h2>
            <pre class="max-h-96 overflow-auto rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800"><code class="language-cpp">${escapeHtml(code)}</code></pre>
            <button class="mt-4 rounded-lg bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 close-modal-btn">Close</button>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.close-modal-btn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });

    // Add syntax highlighting if a library like Prism.js or highlight.js is available
    if (window.Prism) {
        Prism.highlightAll();
    }
  }

  const escapeHtml = (unsafe) => {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
  }


  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProblems = problems.filter((problem) =>
      problem.name.toLowerCase().includes(searchTerm)
    );
    displayProblems(filteredProblems);
  });

  fetchProblems();
});
