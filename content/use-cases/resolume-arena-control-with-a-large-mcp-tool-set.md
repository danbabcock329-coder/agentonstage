---
title: "Resolume Arena control with a large MCP tool set"
slug: resolume-arena-control-with-a-large-mcp-tool-set
category: "LED/Video"
tools: ["Resolume Arena", "MCP"]
difficulty: Intermediate
source_url: https://github.com/drohi-r/resolume-mcp
summary: "An MCP server covering playback, composition and Advanced Output for agent-assisted VJ and LED work."
---

## What it does

An MCP server covering playback, composition and Advanced Output for agent-assisted VJ and LED work.

## How to set it up

1. Clone, `uv sync`, and run `uv run python -m resolume_mcp` (it connects to localhost:8080).
2. In Resolume enable the HTTP API under Preferences → OSC/HTTP.
3. For remote rigs set RESOLUME_HOST and add it to RESOLUME_ALLOWED_HOSTS; use LAN or WireGuard, never the public internet.

Source project: [drohi-r/resolume-mcp](https://github.com/drohi-r/resolume-mcp)

## FAQ

### What does it cover?
About 200 tools for composition, playback, Advanced Output and show recovery over REST, WebSocket and OSC.

### Does it work with other gear?
The author also publishes grandMA2, MADRIX and Companion MCPs.
