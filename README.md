# DevOps Learning Hub

A lightweight website for learning DevOps skills and preparing for interviews.

## Features

- Curated DevOps learning roadmap (Linux, CI/CD, Containers, Cloud, Monitoring).
- Interview question practice by role.
- Auto-updated content blocks:
  - Latest DevOps articles from Dev.to API.
  - Trending DevOps open-source projects from GitHub Search API.

## Run locally

Because this project uses `fetch` for local JSON, serve it over HTTP:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
