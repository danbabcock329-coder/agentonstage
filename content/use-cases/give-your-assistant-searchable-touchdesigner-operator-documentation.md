---
title: "Give your assistant searchable TouchDesigner operator documentation"
slug: give-your-assistant-searchable-touchdesigner-operator-documentation
category: "TouchDesigner"
tools: ["TouchDesigner", "MCP"]
difficulty: Beginner
source_url: https://github.com/bottobot/touchdesigner-mcp-server
summary: "A documentation-focused MCP server so an assistant can look up operators, Python API details and tutorials instead of guessing."
---

## What it does

A documentation-focused MCP server so an assistant can look up operators, Python API details and tutorials instead of guessing.

## How to set it up

1. Install globally: `npm install -g @bottobot/td-mcp`.
2. Add it to your MCP settings with command `npx` and args `["@bottobot/td-mcp"]`.
3. Ask your assistant about specific operators or Python API calls while you build; answers come from bundled docs.

Source project: [bottobot/touchdesigner-mcp-server](https://github.com/bottobot/touchdesigner-mcp-server)

## FAQ

### Does it control TouchDesigner?
No. It serves documentation (operators, Python API, tutorials) from local JSON files. Pair it with a control MCP if you need that.

### Does it need internet?
No network requests are needed; all docs are local.
