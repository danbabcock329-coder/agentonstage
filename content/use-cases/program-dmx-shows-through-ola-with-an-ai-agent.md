---
title: "Program DMX shows through OLA with an AI agent"
slug: program-dmx-shows-through-ola-with-an-ai-agent
category: "Lighting"
tools: ["DMX", "OLA", "MCP"]
difficulty: Intermediate
source_url: https://github.com/prmichaelsen/dmx-mcp
labels: ["Experimental"]
summary: "An MCP server for building and running DMX lighting shows via the Open Lighting Architecture."
---

## What it does

An MCP server for building and running DMX lighting shows via the Open Lighting Architecture.

## How to set it up

1. Install OLA and start it with `olad`; connect an Enttec USB DMX (or other OLA interface).
2. Install Node.js 20+, then `npm install` and `npm run build`.
3. Register the server with your agent and describe fixtures, scenes and cues in plain language.

Source project: [prmichaelsen/dmx-mcp](https://github.com/prmichaelsen/dmx-mcp)

## FAQ

### What does the agent handle?
Fixture patching, scene creation, cue sequencing and live playback.

### How mature is it?
Early. The repo is small and organized around a development methodology, so test thoroughly.
