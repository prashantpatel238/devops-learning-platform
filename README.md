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
- Tool decision guide for Docker, Kubernetes, Terraform, and CI/CD with:
  - why the tool exists
  - when to use it
  - when NOT to use it
  - alternatives used in industry
  - startup vs enterprise examples
- Hands-on AWS + Kubernetes labs for Docker, Kubernetes, Terraform, and CI/CD with:
  - objective
  - architecture diagram description
  - step-by-step commands
  - expected output
  - common failure cases
  - cleanup steps
- Break & Fix labs (Docker + Kubernetes) with intentional misconfigurations, debugging via logs/events/metrics, and SRE-style solution workflows.
- Structured learning paths with required lessons, labs, and skills gained for:
  - Beginner DevOps Engineer
  - Kubernetes Administrator
  - DevOps Engineer (AWS)
  - SRE Path
- Learning indicators and badges across platform cards:
  - Used in production
  - Enterprise pattern
  - Anti-pattern
  - Interview favorite
- Auto-updated content blocks:
  - Latest DevOps articles from Dev.to API.
  - Trending DevOps open-source projects from GitHub Search API.
- Interactive sticky menu for navigating sections quickly.
- Modular JavaScript architecture (`js/api.js`, `js/renderers.js`, `js/ui.js`, `js/main.js`) for easier maintenance.
- Online hosting via GitHub Pages with auto-deploy workflow.
- AI-powered Codex features via backend API (`backend/server.js`):
  - Explain this topic in simple terms
  - Generate interview questions from this lesson
  - Create real-world scenario questions
  - Detect outdated DevOps content

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


## Architecture

- Full system architecture: `docs/ARCHITECTURE.md`


## API-first refactor proposal

- Refactor plan: `docs/API_REFACTOR_PLAN.md`
- Versioned API contract (OpenAPI): `docs/api/openapi.v1.yaml`


## Run AI backend locally

```bash
node backend/server.js
```

AI endpoints are served at `http://127.0.0.1:8787/api/v1/ai/*` and consumed by the UI.


## Automated content updates (with human approval)

- Workflow: `.github/workflows/automated-content-updates.yml`
- Detection script: `scripts/content_change_watcher.py`
- Tracks upstream changes for Kubernetes, Terraform, and Docker.
- Generates Codex-style summaries and content update drafts.
- Opens a **draft PR** for mandatory human review before publishing.
- Details: `docs/AUTOMATED_CONTENT_UPDATES.md`


## Complete CI/CD pipeline

- Workflow: `.github/workflows/full-cicd.yml`
- Builds frontend and backend
- Runs checks/tests
- Builds and pushes Docker images to GHCR
- Runs Terraform plan (optional apply via manual dispatch input)
- Deploys to Kubernetes using Helm
- Sends Slack notification on pipeline failure

Supporting assets:
- `Dockerfile.frontend`
- `Dockerfile.backend`
- `helm/devops-learning/*`
- `infra/terraform/*`
- `docs/CICD_PIPELINE.md`
