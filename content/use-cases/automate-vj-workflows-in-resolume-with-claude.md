---
title: "Automate VJ workflows in Resolume with Claude"
slug: automate-vj-workflows-in-resolume-with-claude
category: "LED/Video"
tools: ["Resolume Avenue/Arena", "MCP"]
difficulty: Beginner
source_url: https://github.com/Tortillaguy/resolume-mcp
summary: "Lets an assistant trigger clips and manage layers in Resolume from natural-language requests."
---

## What it does

Lets an assistant trigger clips and manage layers in Resolume from natural-language requests.

## How to set it up

1. `pip install git+https://github.com/Tortillaguy/resolume-mcp.git`.
2. Add `resolume-mcp-code` to your MCP config with RESOLUME_HOST set to the Resolume machine.
3. Ask for things like "fade out layer 1, connect clip 3 on layer 2"; it batches them over WebSocket.

Source project: [Tortillaguy/resolume-mcp](https://github.com/Tortillaguy/resolume-mcp)

## FAQ

### Which clients?
Claude Desktop, Claude Code, Cursor, Windsurf and other MCP clients.

### Arena or Avenue?
Both.
