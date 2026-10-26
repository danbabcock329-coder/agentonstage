---
title: "Inspect and edit QLab 5 workspaces safely with an agent"
slug: inspect-and-edit-qlab-5-workspaces-safely-with-an-agent
category: "Show Control"
tools: ["QLab 5", "OSC", "MCP"]
difficulty: Intermediate
source_url: https://github.com/MarcheKEN/Qlab-MCP
summary: "A safety-focused MCP server for QLab 5 over OSC: 43 read-only tools for workspaces and cues, and five write tools that dry-run first. It has no playback tools."
---

## What it does

A safety-focused MCP server for QLab 5 over OSC: 43 read-only tools for workspaces and cues, and five write tools that dry-run first. It has no playback tools.

## How to set it up

1. Install the FastMCP server per the README and point it at QLab 5's OSC port.
2. Start read-only (the default) and use inspection tools to browse workspace settings and cues.
3. Enable write mode only if you need to; writes are dry-run-first and need confirmation.

Source project: [MarcheKEN/Qlab-MCP](https://github.com/MarcheKEN/Qlab-MCP)

## FAQ

### Can it fire cues?
No. By design it has no playback tools or raw-protocol escape hatch.

### How many tools?
43 read-only tools and 5 gated write tools.
