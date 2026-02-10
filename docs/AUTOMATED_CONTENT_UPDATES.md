# Automated Content Update System (GitHub Actions + Human Approval)

This repository now includes an automated content update pipeline implemented as a **GitHub Action**.

## What it does

1. Detects upstream release changes for:
   - Kubernetes (`kubernetes/kubernetes`)
   - Terraform (`hashicorp/terraform`)
   - Docker (`docker/cli`)
2. Generates Codex-style summaries for detected changes.
3. Produces update artifacts:
   - `content/auto-updates/latest-update.md`
   - `content/auto-updates/latest-update.json`
   - `content/auto-updates/tool_versions.json`
4. Opens a **draft PR** requiring manual human review and approval before merge/publish.

---

## Workflow file

- `.github/workflows/automated-content-updates.yml`

### Trigger modes
- Scheduled daily (`cron: 0 6 * * *`)
- Manual dispatch (`workflow_dispatch`)

---

## Human approval gate

Publishing is intentionally gated by people:
- PR is opened as **draft**.
- PR body includes a required review checklist.
- Team must manually review/approve and merge.

> Recommended: add branch protection rule requiring at least 1 reviewer on the default branch.

---

## Local test

```bash
python3 scripts/content_change_watcher.py
```

This generates or updates files under `content/auto-updates/`.

---

## How Codex is used

The watcher script creates Codex-style summaries for release changes and recommended content updates:
- update learning modules/tool guides
- validate lab command/API compatibility
- propose interview question refreshes

This gives maintainers a fast first draft while preserving a human-in-the-loop quality gate.
