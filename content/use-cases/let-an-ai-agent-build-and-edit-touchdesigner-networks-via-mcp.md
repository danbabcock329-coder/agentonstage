---
title: "Let an AI agent build and edit TouchDesigner networks via MCP"
slug: let-an-ai-agent-build-and-edit-touchdesigner-networks-via-mcp
category: "TouchDesigner"
tools: ["TouchDesigner", "MCP", "Claude/Cursor"]
difficulty: Intermediate
source_url: https://github.com/8beeeaaat/touchdesigner-mcp
summary: "Connect an MCP-capable assistant to a running TouchDesigner project so it can create, inspect and wire operators from plain-language requests."
---

## What it does

Connect an MCP-capable assistant to a running TouchDesigner project so it can create, inspect and wire operators from plain-language requests.

## How to set it up

1. Install TouchDesigner and enable its WebServer DAT-based API component from the project's Installation Guide (docs/installation.md) — the MCP server talks to TD through it.
2. Add the `touchdesigner-mcp-server` package (published on npm) to your MCP client, or simply tell your agent "Set up https://github.com/8beeeaaat/touchdesigner-mcp" as the README suggests.
3. Ask the agent to list nodes in /project1, then create and wire a small TOP chain to confirm round-trips.
4. Before updating, follow the notes on the repo's latest release page.

Source project: [8beeeaaat/touchdesigner-mcp](https://github.com/8beeeaaat/touchdesigner-mcp)

## FAQ

### How does the agent reach TouchDesigner?
Through TouchDesigner's built-in web server: the MCP server sends requests to an API component running inside your .toe.

### Is there a demo?
Yes, the README links a YouTube walkthrough of an agent building a particle system in TD.
