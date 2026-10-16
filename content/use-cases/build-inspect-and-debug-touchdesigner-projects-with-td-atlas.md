---
title: "Build, inspect and debug TouchDesigner projects with td-atlas"
slug: build-inspect-and-debug-touchdesigner-projects-with-td-atlas
category: "TouchDesigner"
tools: ["TouchDesigner", "MCP", "Claude Code"]
difficulty: Advanced
source_url: https://github.com/grigabyte/td-atlas
labels: ["Experimental"]
summary: "An open-source MCP connector that indexes your own TouchDesigner install, edits a running project in one undoable step, and flags failures TD doesn't report."
---

## What it does

td-atlas is a free, MIT-licensed connector between TouchDesigner and MCP agents such as Claude Code. It gives the agent three things. First, an index of every operator and parameter built from your own copy of TouchDesigner, so the agent uses real names instead of guessing. Second, a live bridge into the running project, where each batch of edits lands as one undoable block, and the agent can render TOPs to see what it made. Third, an offline reader that searches, diffs and snapshots `.toe` and `.tox` files without opening them.

The standout for show work is its health check, which looks for problems TouchDesigner stays quiet about, like branches that never cook or feedback loops that don't advance. It can also save a text version of the network beside the `.toe` on every save, so a project gets a diffable history in git.

## How to set it up

1. Make sure TouchDesigner and Python 3.11 or newer are on the same computer.
2. On macOS, run the one-line installer from the docs. On Windows, follow the step-by-step clone and install sequence in the README.
3. Build the index with `td-atlas build`, then run `td-atlas install` to stage the bridge and print the MCP line for your client.
4. Load the bridge into a copy of your project first. It never saves for you, but its edits are real edits in the open file.

Source project: [grigabyte/td-atlas](https://github.com/grigabyte/td-atlas), announced on the [Derivative community site](https://derivative.ca/community-post/asset/td-atlas-%E2%80%94-mcp-connector-lets-ai-agent-build-inspect-and-debug-touchdesigner)

## FAQ

### Does it work on Windows?
The author measured it on macOS. Windows code paths run in CI, but it hasn't been tested against TouchDesigner on Windows yet.

### Can I undo what the agent did?
Yes. Each set of bridge edits is grouped so one Ctrl+Z puts it all back.

### Is it on PyPI?
No. You install it from the GitHub repo.
