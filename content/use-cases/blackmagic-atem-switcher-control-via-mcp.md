---
title: "Blackmagic ATEM switcher control via MCP"
slug: blackmagic-atem-switcher-control-via-mcp
category: "LED/Video"
tools: ["Blackmagic ATEM", "MCP"]
difficulty: Intermediate
source_url: https://github.com/guycochran/atem-mcp-server
summary: "An MCP server that drives a Blackmagic ATEM from an assistant, locally over stdio or remotely over Streamable HTTP with OAuth, including cuts, macros, and streaming."
---

## What it does

An MCP server that drives a Blackmagic ATEM from an assistant, locally over stdio or remotely over Streamable HTTP with OAuth, including cuts, macros, and streaming.

## How to set it up

1. `npm install` and `npm run build` in the repo.
2. Add the server to Claude Desktop with the full node path and ATEM_HOST set to your switcher's IP.
3. Restart Claude, then try "show me the current switcher status" before any cuts.

Source project: [guycochran/atem-mcp-server](https://github.com/guycochran/atem-mcp-server)

## FAQ

### Local only?
No. It supports local stdio and remote Streamable HTTP with OAuth 2.0.

### Typical requests?
"Put camera 2 on program and dissolve", "run macro 3" and start/stop streaming.
