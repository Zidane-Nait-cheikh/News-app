const apiKey = "9f7d56f0-df10-42d8-b99c-30d26986a647";
const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("Search-bar");
const searchButton = document.getElementById("search-btn");
const resultsBar = document.getElementById("results-bar");
const resultsLabel = document.getElementById("results-label");
const clearSearchBtn = document.getElementById("clear-search");
const emptyState = document.getElementById("empty-state");
const errorState = document.getElementById("error-state");
const errorMessage = document.getElementById("error-message");
const retryBtn = document.getElementById("retry-btn");
const themeToggle = document.getElementById("theme-toggle");
const categoryButtons = document.querySelectorAll(".cat-btn");

let currentCategory = "general";
let currentQuery = "";

// Guardian section mapping
const categoryMap = {
  general:       "",
  technology:    "technology",
  business:      "business",
  sports:        "sport",
  health:        "society",
  science:       "science",
  entertainment: "culture",
};

// ── Theme toggle ──────────────────────────────────────────────
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeToggle.textContent = theme === "dark" ? "☀" : "☾";
}

// ── Category navigation ───────────────────────────────────────
categoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    currentQuery = "";
    searchField.value = "";
    hideResultsBar();
    loadNews();
  });
});

// ── Search ────────────────────────────────────────────────────
searchButton.addEventListener("click", handleSearch);
searchField.addEventListener("keydown", e => {
  if (e.key === "Enter") handleSearch();
});

async function handleSearch() {
  const query = searchField.value.trim();
  if (!query) return;
  currentQuery = query;
  categoryButtons.forEach(b => b.classList.remove("active"));
  try {
    showSkeletons();
    const articles = await fetchQueryNews(query);
    showResults(`Results for "${query}"`, articles.length);
    displayBlogs(articles);
  } catch (err) {
    showError(err.message);
  }
}

clearSearchBtn.addEventListener("click", () => {
  searchField.value = "";
  currentQuery = "";
  hideResultsBar();
  const firstBtn = document.querySelector('.cat-btn[data-category="general"]');
  firstBtn.classList.add("active");
  currentCategory = "general";
  loadNews();
});

retryBtn.addEventListener("click", () => {
  if (currentQuery) handleSearch();
  else loadNews();
});

// ── API calls (The Guardian — CORS-friendly) ──────────────────
const BASE = "https://content.guardianapis.com";
const FIELDS = "thumbnail,trailText,byline";

async function fetchTopHeadlines(category = "general") {
  const section = categoryMap[category];
  const sectionParam = section ? `&section=${section}` : "";
  const url = `${BASE}/search?api-key=${apiKey}&show-fields=${FIELDS}&order-by=newest&page-size=20${sectionParam}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.response.status !== "ok") throw new Error("API error");
  return normalizeArticles(data.response.results);
}

async function fetchQueryNews(query) {
  const url = `${BASE}/search?api-key=${apiKey}&q=${encodeURIComponent(query)}&show-fields=${FIELDS}&order-by=newest&page-size=20`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.response.status !== "ok") throw new Error("API error");
  return normalizeArticles(data.response.results);
}

// Normalize Guardian response to internal article shape
function normalizeArticles(results = []) {
  return results.map(r => ({
    title:       r.webTitle,
    description: r.fields?.trailText || "",
    urlToImage:  r.fields?.thumbnail || null,
    url:         r.webUrl,
    publishedAt: r.webPublicationDate,
    source:      { name: r.sectionName || "" },
  }));
}

// ── Load news ─────────────────────────────────────────────────
async function loadNews() {
  try {
    showSkeletons();
    const articles = await fetchTopHeadlines(currentCategory);
    const label = currentCategory !== "general" ? currentCategory : "";
    displayBlogs(articles, label);
  } catch (err) {
    showError(err.message);
  }
}

// ── Display ───────────────────────────────────────────────────
function displayBlogs(articles, categoryLabel = "") {
  blogContainer.innerHTML = "";
  hideError();
  hideEmpty();

  const valid = articles.filter(a => a.title && a.title !== "[Removed]");

  if (valid.length === 0) {
    showEmpty();
    return;
  }

  valid.forEach(article => {
    const card = createCard(article, categoryLabel);
    blogContainer.appendChild(card);
  });
}

function createCard(article, categoryLabel = "") {
  const card = document.createElement("div");
  card.classList.add("blog-card");

  const publishedDate = article.publishedAt ? formatDate(article.publishedAt) : "";
  const sourceName = article.source?.name || "";
  const desc = article.description && article.description !== "null"
    ? escapeHtml(article.description)
    : "";

  card.innerHTML = `
    <div class="card-image-wrapper">
      ${article.urlToImage
        ? `<img src="${article.urlToImage}" alt="${escapeHtml(article.title)}" onerror="this.parentElement.innerHTML='<div class=card-img-fallback>📰</div>'">`
        : `<div class="card-img-fallback">📰</div>`}
      ${sourceName ? `<span class="card-source-badge">${escapeHtml(sourceName)}</span>` : ""}
    </div>
    <div class="card-body">
      <div class="card-meta">
        ${publishedDate ? `<span class="card-date">${publishedDate}</span>` : ""}
        ${publishedDate && categoryLabel ? `<span class="card-dot"></span>` : ""}
        ${categoryLabel ? `<span class="card-category">${categoryLabel}</span>` : ""}
      </div>
      <h2 class="card-title">${escapeHtml(article.title)}</h2>
      ${desc ? `<p class="card-desc">${desc}</p>` : ""}
    </div>
    <div class="card-footer">
      <span class="card-read-more">Read article</span>
    </div>
  `;

  card.addEventListener("click", () => window.open(article.url, "_blank"));
  return card;
}

// ── Skeleton ──────────────────────────────────────────────────
function showSkeletons(count = 9) {
  hideError();
  hideEmpty();
  const skeletonHTML = `
    <div class="skeleton-card">
      <div class="skeleton-line tall"></div>
      <div class="skeleton-body">
        <div class="skeleton-line w40"></div>
        <div class="skeleton-line full"></div>
        <div class="skeleton-line w80"></div>
        <div class="skeleton-line w60"></div>
      </div>
    </div>`;
  blogContainer.innerHTML = Array(count).fill(skeletonHTML).join("");
}

// ── State helpers ─────────────────────────────────────────────
function showResults(label, count) {
  resultsLabel.textContent = `${count} articles — ${label}`;
  resultsBar.style.display = "flex";
}

function hideResultsBar() {
  resultsBar.style.display = "none";
}

function showEmpty() {
  emptyState.style.display = "block";
}

function hideEmpty() {
  emptyState.style.display = "none";
}

function showError(msg) {
  blogContainer.innerHTML = "";
  errorMessage.textContent = msg || "Unable to fetch news. Please try again.";
  errorState.style.display = "block";
}

function hideError() {
  errorState.style.display = "none";
}

// ── Utils ─────────────────────────────────────────────────────
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Init ──────────────────────────────────────────────────────
loadNews();
