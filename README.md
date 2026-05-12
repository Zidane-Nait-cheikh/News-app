# News World

A clean, fully responsive news aggregator built with vanilla HTML, CSS, and JavaScript — powered by [The Guardian API](https://open-platform.theguardian.com/).

**Live site:** [Zidane-Nait-cheikh.github.io/News-app](https://Zidane-Nait-cheikh.github.io/News-app/)

---

## Latest Update

- **Phone responsiveness** — navbar stacks into two rows on small screens, full-width search bar, fluid hero heading, larger touch targets, single-column card grid with optimized spacing, and extra tweaks for very small phones (≤ 360px).

---

## Features

- **Top Headlines** by category: Technology, Business, Sports, Health, Science, Entertainment
- **Search** any topic with real-time results
- **Dark / Light mode** with local storage persistence
- **Skeleton loading** cards while fetching
- **Fully responsive** — optimized for desktop, tablet, and mobile phones
- Empty & error states with retry support

## Tech Stack

| Layer | Tools |
|-------|-------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, grid, animations, media queries) |
| Logic | Vanilla JavaScript (async/await, Fetch API) |
| Data | The Guardian Open Platform API |
| Font | Inter (Google Fonts) |

## Getting Started

```bash
git clone https://github.com/Zidane-Nait-cheikh/News-app.git
cd News-app
# Open index.html in your browser or use a local server:
npx serve .
```

> **Note:** The Guardian API is CORS-friendly and works directly from the browser with no backend proxy required.

## Project Structure

```
News-app/
├── index.html   # App shell & markup
├── style.css    # All styles (themes, grid, animations, responsive)
└── script.js    # API calls, rendering, state management
```

---

Made by [Zidane-Nait-cheikh](https://github.com/Zidane-Nait-cheikh)
