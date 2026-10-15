---
title: "Drive QLC+ from Claude Desktop over WebSocket"
slug: drive-qlc-from-claude-desktop-over-websocket
category: "Lighting"
tools: ["QLC+", "WebSocket", "MCP"]
difficulty: Beginner
source_url: https://github.com/guac395/qlc-plus-mcp
summary: "An MCP server that exposes QLC+ functions so an assistant can run free, open-source lighting control."
---

## What it does

An MCP server that exposes QLC+ functions so an assistant can run free, open-source lighting control.

## How to set it up

1. Clone, install and `npm run build`.
2. Launch QLC+ with its web interface: `qlcplus -w` (macOS: /Applications/QLC+.app/Contents/MacOS/qlcplus -w).
3. Add the server to Claude Desktop with QLC_HOST=localhost and QLC_PORT=9999, then restart.

Source project: [guac395/qlc-plus-mcp](https://github.com/guac395/qlc-plus-mcp)

## FAQ

### How many tools?
25, covering scenes, DMX channel writes, widgets, workspace generation and effect sequencing.

### Is there a non-Claude option?
Yes, a standalone Gemini CLI agent under src/agent.
