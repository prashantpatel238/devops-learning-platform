#!/usr/bin/env python3
"""
Detect upstream tool changes (Kubernetes, Terraform, Docker), generate a Codex-style
summary draft, and prepare repository content updates for human review.
"""

from __future__ import annotations

import datetime as dt
import json
import os
import pathlib
import re
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parents[1]
STATE_PATH = ROOT / "content" / "auto-updates" / "tool_versions.json"
REPORT_MD_PATH = ROOT / "content" / "auto-updates" / "latest-update.md"
REPORT_JSON_PATH = ROOT / "content" / "auto-updates" / "latest-update.json"

TOOLS = {
    "kubernetes": {
        "repo": "kubernetes/kubernetes",
        "release_url": "https://api.github.com/repos/kubernetes/kubernetes/releases/latest",
    },
    "terraform": {
        "repo": "hashicorp/terraform",
        "release_url": "https://api.github.com/repos/hashicorp/terraform/releases/latest",
    },
    "docker": {
        "repo": "docker/cli",
        "release_url": "https://api.github.com/repos/docker/cli/releases/latest",
    },
}


def github_get_json(url: str) -> dict:
    token = os.getenv("GITHUB_TOKEN", "")
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "devops-learning-platform-content-watcher",
    }
    if token:
        headers["Authorization"] = f"Bearer {token}"

    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=20) as response:  # nosec B310
        return json.loads(response.read().decode("utf-8"))


def strip_markdown(text: str) -> str:
    text = re.sub(r"```[\s\S]*?```", " ", text)
    text = re.sub(r"`([^`]*)`", r"\1", text)
    text = re.sub(r"\[(.*?)\]\(.*?\)", r"\1", text)
    text = re.sub(r"[#>*_~-]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def codex_style_summary(tool: str, version: str, notes: str) -> str:
    clean = strip_markdown(notes)[:500]
    return (
        f"Codex summary ({tool} {version}): focus first on upgrade risk and compatibility. "
        f"Key upstream notes indicate: {clean or 'No detailed release notes were provided.'} "
        "Before rollout, validate CI pipelines, cluster/runtime compatibility, and rollback steps in staging."
    )


def load_state() -> dict:
    if not STATE_PATH.exists():
        return {}
    return json.loads(STATE_PATH.read_text())


def save_state(state: dict) -> None:
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(json.dumps(state, indent=2) + "\n")


def run() -> int:
    previous = load_state()
    current = {}
    changes = []

    for tool, cfg in TOOLS.items():
        try:
            data = github_get_json(cfg["release_url"])
        except urllib.error.URLError as error:
            print(f"WARN: unable to fetch release for {tool}: {error}")
            continue

        version = data.get("tag_name") or "unknown"
        published_at = data.get("published_at") or data.get("created_at") or "unknown"
        notes = data.get("body") or ""

        current[tool] = {
            "repo": cfg["repo"],
            "version": version,
            "published_at": published_at,
            "url": data.get("html_url", ""),
        }

        prev_version = previous.get(tool, {}).get("version")
        if prev_version != version:
            changes.append(
                {
                    "tool": tool,
                    "previous_version": prev_version,
                    "new_version": version,
                    "published_at": published_at,
                    "release_url": data.get("html_url", ""),
                    "codex_summary": codex_style_summary(tool, version, notes),
                    "suggested_content_updates": [
                        f"Update tool guide references for {tool} to {version}.",
                        f"Review break/fix labs for {tool} for deprecated flags/APIs.",
                        f"Add one interview question about migration impact from {prev_version or 'older versions'} to {version}.",
                    ],
                }
            )

    save_state(current)

    generated_at = dt.datetime.utcnow().isoformat() + "Z"
    payload = {
        "generated_at": generated_at,
        "changes": changes,
        "requires_human_approval": True,
        "approval_note": "Review and approve this PR before merge/publish.",
    }
    REPORT_JSON_PATH.write_text(json.dumps(payload, indent=2) + "\n")

    lines = [
        "# Automated DevOps Content Update Draft",
        "",
        f"Generated at: `{generated_at}`",
        "",
        "## Detected tool changes",
    ]

    if not changes:
        lines.append("- No upstream tool changes detected in this run.")
        REPORT_MD_PATH.write_text("\n".join(lines) + "\n")
        print("No upstream tool changes detected.")
        return 0
    for change in changes:
        lines.extend(
            [
                f"### {change['tool'].title()} — {change['previous_version'] or 'unknown'} -> {change['new_version']}",
                f"- Release: {change['release_url']}",
                f"- Published: {change['published_at']}",
                f"- Codex summary: {change['codex_summary']}",
                "- Suggested content updates:",
            ]
        )
        lines.extend([f"  - {item}" for item in change["suggested_content_updates"]])
        lines.append("")

    lines.extend(
        [
            "## Human approval gate",
            "- [ ] Content owner reviewed generated summary and recommendations.",
            "- [ ] Labs reviewed for command/API compatibility.",
            "- [ ] Interview questions updated if required.",
            "- [ ] PR approved by human reviewer before merge.",
        ]
    )

    REPORT_MD_PATH.write_text("\n".join(lines) + "\n")
    print(f"Generated update draft: {REPORT_MD_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(run())
