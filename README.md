# DevOps Learning Hub

A practical DevOps learning website focused on **production reality** (not just theory):
scale limits, enterprise failure modes, cost trade-offs, security risks, and incident response thinking.

## Features

- Curated DevOps roadmap with practical, senior-level guidance for:
  - Linux & Networking
  - Version Control & CI/CD
  - Containers & Orchestration
  - Cloud & IaC
  - Monitoring & Security
- Interview prep questions framed as real production scenarios.
- Auto-updated content blocks:
  - Latest DevOps articles from Dev.to API.
  - Trending DevOps open-source projects from GitHub Search API.
- Online hosting via GitHub Pages with auto-deploy workflow.

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
