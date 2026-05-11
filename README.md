# News World 📰

A clean, responsive news aggregator built with vanilla HTML, CSS, and JavaScript — powered by [NewsAPI](https://newsapi.org).

🔗 **Live site:** [zid12256.github.io/News-app](https://zid12256.github.io/News-app/)

---

## Features

- **Top Headlines** by category: Technology, Business, Sports, Health, Science, Entertainment
- **Search** any topic with real-time results
- **Dark / Light mode** with local storage persistence
- **Skeleton loading** cards while fetching
- **Responsive** grid layout (mobile-friendly)
- Empty & error states with retry support

## Tech Stack

| Layer | Tools |
|-------|-------|
| Markup | HTML5 |
| Styling | CSS3 (custom properties, grid, animations) |
| Logic | Vanilla JavaScript (async/await, Fetch API) |
| Data | NewsAPI v2 |
| Font | Inter (Google Fonts) |

## Getting Started

```bash
git clone https://github.com/zid12256/News-app.git
cd News-app
# Open index.html in your browser or use a local server:
npx serve .
```

> **Note:** NewsAPI free tier only allows browser requests from `localhost`.  
> For production deployment, a backend proxy or a CORS-friendly API is required.

## Project Structure

```
News-app/
├── index.html   # App shell & markup
├── style.css    # All styles (themes, grid, animations)
└── script.js    # API calls, rendering, state management
```

---

Made by [zid12256](https://github.com/zid12256)
