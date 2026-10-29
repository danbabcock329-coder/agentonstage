---
title: "Ableton Live control over OSC through MCP"
slug: ableton-live-control-over-osc-through-mcp
category: "Audio"
tools: ["Ableton Live", "OSC", "MCP"]
difficulty: Intermediate
source_url: https://github.com/Simon-Kansara/ableton-live-mcp-server
summary: "Exposes Ableton Live's OSC interface to AI assistants for session and transport control by turning AbletonOSC addresses into MCP tools. It needs Python 3.8+, python-osc, fastmcp, and uv."
---

## What it does

Exposes Ableton Live's OSC interface to AI assistants for session and transport control.

## How to set it up

1. Install AbletonOSC as a control surface in Live.
2. Clone the repo and run `uv sync`.
3. Start the OSC daemon with `uv run osc_daemon.py`, then register the MCP server in your client.

Source project: [Simon-Kansara/ableton-live-mcp-server](https://github.com/Simon-Kansara/ableton-live-mcp-server)

## FAQ

### What does it map?
It exposes the available AbletonOSC addresses as MCP tools.

### Requirements?
Python 3.8+, python-osc, fastmcp and uv.
