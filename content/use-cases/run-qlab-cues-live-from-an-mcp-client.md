---
title: "Run QLab cues live from an MCP client"
slug: run-qlab-cues-live-from-an-mcp-client
category: "Show Control"
tools: ["QLab", "OSC", "MCP"]
difficulty: Intermediate
source_url: https://github.com/magichao326/qlab-mcp
summary: "Query workspaces, search cues and fire or stop them from an assistant over OSC."
---

## What it does

Query workspaces, search cues and fire or stop them from an assistant over OSC.

## How to set it up

1. Clone, create a venv and `pip install -r requirements.txt`.
2. Add the venv's python and server.py to your Claude Desktop or Claude Code config.
3. Set QLAB_HOST, QLAB_SEND_PORT (53000), QLAB_RECV_PORT (53001) and QLAB_PASSCODE if needed.

Source project: [magichao326/qlab-mcp](https://github.com/magichao326/qlab-mcp)

## FAQ

### Can it GO?
Yes. It can start/stop cues and send raw OSC or AppleScript, so the README warns about unattended tool calls in a live show.

### Remote Mac?
Set QLAB_HOST to that Mac's IP.
