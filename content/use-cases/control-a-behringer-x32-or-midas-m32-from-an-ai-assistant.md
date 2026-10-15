---
title: "Control a Behringer X32 or Midas M32 from an AI assistant"
slug: control-a-behringer-x32-or-midas-m32-from-an-ai-assistant
category: "Audio"
tools: ["Behringer X32", "Midas M32", "OSC", "MCP"]
difficulty: Intermediate
source_url: https://github.com/anteriovieira/osc-mcp-server
summary: "An MCP server that maps mixer actions to OSC so an assistant can read and set faders, mutes and routing."
---

## What it does

An MCP server that maps mixer actions to OSC so an assistant can read and set faders, mutes and routing.

## How to set it up

1. Install Node.js 18+, then `npm install` and `npm run build` in the repo.
2. Set OSC_HOST to the console's IP and OSC_PORT to 10023 (the defaults are 192.168.1.70 and 10023).
3. Add `node /path/to/dist/index.js` to your Claude Desktop config with those env vars, then restart Claude.
4. Ask for read-only things first (fader levels, mute states) before letting it change anything.

Source project: [anteriovieira/osc-mcp-server](https://github.com/anteriovieira/osc-mcp-server)

## FAQ

### What can it change?
Faders, mutes and pan for channels, buses, aux, matrix and main LR.

### Which consoles?
Behringer X32, Midas M32 and similar OSC mixers.
