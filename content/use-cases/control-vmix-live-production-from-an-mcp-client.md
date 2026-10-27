---
title: "Control vMix live production from an MCP client"
slug: control-vmix-live-production-from-an-mcp-client
category: "LED/Video"
tools: ["vMix", "MCP"]
difficulty: Intermediate
source_url: https://github.com/Scissorfilms/mcp-server-vmix
summary: "An MCP server on vMix's Web Controller so an assistant can switch inputs and run functions for overlays, recording, audio, titles, replay, and scripting. Tools are marked read-only or destructive."
---

## What it does

Lets an assistant switch inputs and run vMix functions for live video production.

## How to set it up

1. Clone and `npm install` (this builds automatically).
2. Enable vMix's Web Controller (Settings → Web Controller, port 8088).
3. Register it: `claude mcp add vmix -s user -e VMIX_HOST=<ip> -e VMIX_PORT=8088 -- node $PWD/dist/index.js`.

Source project: [Scissorfilms/mcp-server-vmix](https://github.com/Scissorfilms/mcp-server-vmix)

## FAQ

### What's covered?
About 70 vMix functions: switching, overlays, recording, audio, titles, replay and scripting.

### Can I see which tools are destructive?
Yes, tools carry readOnlyHint and destructiveHint annotations.
