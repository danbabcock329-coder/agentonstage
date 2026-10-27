---
title: "Expanded X32 MCP server for deeper console control"
slug: expanded-x32-mcp-server-for-deeper-console-control
category: "Audio"
tools: ["Behringer X32", "OSC", "MCP"]
difficulty: Intermediate
source_url: https://github.com/elisha-rudenkov/x32-mcp-server
summary: "A wider X32 OSC MCP server for agents. It can audit scenes, trace signal flow, repair routing, edit EQ, swap FX, and snapshot meters on console port 10023."
---

## What it does

A rewrite of an earlier OSC MCP server with a wider set of X32 tools for agents.

## How to set it up

1. Clone the repo, `npm install` and `npm run build`.
2. Find the mixer IP under Setup → Network on the console.
3. Add the server to your MCP config with OSC_HOST=<mixer IP> and OSC_PORT=10023, then restart the client.
4. See INSTALLATION.md for Cline, Continue.dev and other clients.

Source project: [elisha-rudenkov/x32-mcp-server](https://github.com/elisha-rudenkov/x32-mcp-server)

## FAQ

### What does it add over the original?
Scene audits, signal-flow tracing, routing repair, EQ, FX algorithm swaps and meter snapshots.

### Claude Desktop from the Microsoft Store?
The README gives a different config path for the MSIX install.
