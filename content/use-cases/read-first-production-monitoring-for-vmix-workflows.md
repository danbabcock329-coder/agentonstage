---
title: "Read-first production monitoring for vMix workflows"
slug: read-first-production-monitoring-for-vmix-workflows
category: "Show Control"
tools: ["vMix", "MCP"]
difficulty: Beginner
source_url: https://github.com/greenhouselabs/cuescope-mcp
summary: "CueScope gives an agent read access to production state for reporting and checks without risky writes."
---

## What it does

CueScope gives an agent read access to production state for reporting and checks without risky writes.

## How to set it up

1. `claude mcp add cuescope -- npx -y @greenhouselabs/cuescope-mcp` (or the Codex equivalent).
2. For vMix on another machine add `-e VMIX_HOST=<ip>`.
3. Ask it to explain current vMix state and draft automation plans for review.

Source project: [greenhouselabs/cuescope-mcp](https://github.com/greenhouselabs/cuescope-mcp)

## FAQ

### Will it switch my show?
Not by default. It reads state and doesn't switch inputs, run scripts, start streams or change audio.

### Why use it?
Safe production checks and reporting during shows.
