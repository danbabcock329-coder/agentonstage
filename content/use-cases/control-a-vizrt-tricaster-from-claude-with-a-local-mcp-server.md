---
title: "Control a Vizrt TriCaster from Claude with a local MCP server"
slug: control-a-vizrt-tricaster-from-claude-with-a-local-mcp-server
category: "LED/Video"
tools: ["Vizrt TriCaster", "MCP", "Claude Desktop"]
difficulty: Intermediate
source_url: https://github.com/mkammes/TriCaster_MCP
labels: ["Experimental"]
summary: "A Python MCP server that lets Claude drive a Vizrt TriCaster over its HTTP API for sources, transitions, audio, DDR playback, recording, streaming and macros."
---

## What it does

A Python MCP server that lets Claude drive a Vizrt TriCaster over its HTTP API for sources, transitions, audio, DDR playback, recording, streaming and macros.

## How to set it up

1. Install Python 3.11 or newer, uv and Git, then clone the repo. uv installs dependencies the first time the server starts.
2. Point Claude Desktop at `uv run --project <TriCaster_MCP path> python <path>/server.py`. Set `TRICASTER_HOST` in the MCP env block. Set `TRICASTER_PORT` if the switcher is not on port 80.
3. Put the TriCaster on the same network, with its HTTP API reachable. Fully quit and reopen Claude, then ask for system info and what is on program before any cut.

Source project: [mkammes/TriCaster_MCP](https://github.com/mkammes/TriCaster_MCP)

## FAQ

### What was it tested on?
The README names a TriCaster Mini S and a TriCaster Mini X, both on v8-5 at 1080p29.97. The only GitHub release, v0.2.0, is titled Initial Pre-Release and is marked a pre-release.

### Does a program switch wait for confirmation?
`switch_program` cuts straight to the new program source and goes to air immediately. The server itself is a local stdio process; it uses the TriCaster HTTP API v1 (`/v1/shortcut`, `/v1/dictionary`, `/v1/trigger`, `/v1/datalink`).
