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

## Publish online (GitHub Pages)

1. Push this repository to GitHub.
2. In GitHub repo settings, go to **Settings → Pages**.
3. Under **Build and deployment**, select **Source: GitHub Actions**.
4. Push to your default branch (`main`/`master`/`work`) or run the workflow manually.

After deployment, your site will be available at:

- `https://<your-github-username>.github.io/<repository-name>/`

> Example for this repo name: `https://<your-github-username>.github.io/devops-learning-platform/`
