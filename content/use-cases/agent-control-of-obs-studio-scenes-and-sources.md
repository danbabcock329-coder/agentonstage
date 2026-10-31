---
title: "Agent control of OBS Studio scenes and sources"
slug: agent-control-of-obs-studio-scenes-and-sources
category: "LED/Video"
tools: ["OBS Studio", "obs-websocket", "MCP"]
difficulty: Beginner
source_url: https://github.com/ironystock/agentic-obs
summary: "agentic-obs is an MCP server for OBS Studio. Enable the WebSocket server on port 4455, then an assistant can drive scenes, sources, recording, and streaming. The project lists 81 tools."
---

## What it does

An MCP server that gives assistants programmatic control of OBS for streams and IMAG recording.

## How to set it up

1. `go install github.com/ironystock/agentic-obs@latest` or build from source with `make build`.
2. In OBS open Tools → WebSocket Server Settings, enable it (port 4455) and set a password.
3. Run agentic-obs in MCP server mode and register it with your client.

Source project: [ironystock/agentic-obs](https://github.com/ironystock/agentic-obs)

## FAQ

### How many tools?
81, across scenes, sources, recording, streaming and more.

### Can it start a stream on its own?
Yes, so restrict which tools your client allows during a live show.
