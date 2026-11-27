---
title: "Let an LLM build tracks and clips in Ableton Live"
slug: let-an-llm-build-tracks-and-clips-in-ableton-live-for-playback-rigs
category: "Audio"
tools: ["Ableton Live", "MCP"]
difficulty: Beginner
source_url: https://github.com/ahujasid/ableton-mcp
summary: "The ableton-mcp server, started with uvx, creates tracks and clips in Live after its Remote Script is selected. Run only one instance at a time."
---

## What it does

Popular MCP bridge that lets an assistant create tracks and arrange clips, handy for prepping show playback sessions.

## How to set it up

1. Install uv (`brew install uv` on macOS).
2. Add the server to Claude Desktop (command `uvx`, args `["ableton-mcp"]`) or paste `uvx ableton-mcp` into Cursor's MCP settings.
3. Install the Ableton Remote Script with `uvx --from ableton-mcp ableton-mcp-install-script`, then select it in Live.
4. Ask it to build tracks or clips for your playback session, then check them by ear.

Source project: [ahujasid/ableton-mcp](https://github.com/ahujasid/ableton-mcp)

## FAQ

### Can I run it in two apps at once?
No. The README warns to run only one instance (Cursor or Claude Desktop).

### Is there a setup video?
Yes, linked at the top of the README.
