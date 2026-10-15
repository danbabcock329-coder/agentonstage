---
title: "Control a grandMA3 console with an AI assistant"
slug: control-a-grandma3-console-with-an-ai-assistant
category: "Lighting"
tools: ["grandMA3", "MCP"]
difficulty: Advanced
source_url: https://github.com/Pahegi/ma3-mcp
labels: ["Experimental"]
summary: "An MCP server that sends commands to grandMA3 so an assistant can help program and operate a lighting rig."
---

## What it does

An MCP server that sends commands to grandMA3 so an assistant can help program and operate a lighting rig.

## How to set it up

1. `poetry install` the Python dependencies and set your MA3 path in .env.
2. Run ./deploy.sh or copy plugin/mcp_server.lua into the MA3 plugins folder.
3. In MA3 go to Menu → Plugins, start the MCP Server plugin, then configure Claude Desktop or VS Code Copilot.
4. Test on onPC, never on a show console.

Source project: [Pahegi/ma3-mcp](https://github.com/Pahegi/ma3-mcp)

## FAQ

### Is it production ready?
No. The README labels it a prototype and proof of concept.

### What can it do?
Run MA3 commands, control fixtures, store cues and run playbacks.
