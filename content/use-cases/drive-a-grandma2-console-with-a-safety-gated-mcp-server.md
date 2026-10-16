---
title: "Drive a grandMA2 console with a safety-gated MCP server"
slug: drive-a-grandma2-console-with-a-safety-gated-mcp-server
category: "Lighting"
tools: ["grandMA2", "grandMA2 onPC", "MCP", "Telnet"]
difficulty: Advanced
source_url: https://github.com/drohi-r/grandma2-mcp
labels: ["Experimental"]
summary: "An MCP server for grandMA2 playback, programming, patch and show files over Telnet, with risk tiers that block destructive commands until you confirm."
---

## What it does

An open-source MCP server that lets an assistant drive a grandMA2 console over Telnet. It covers playback, programming, user management, show files and busking, and adds a built-in orchestrator that breaks a goal into steps and keeps memory between sessions.

The part that matters on a real rig is the safety gate. Every command is sorted into a risk tier before it reaches the desk: reads are always allowed, standard writes run in normal mode, and destructive actions are blocked until you explicitly confirm. It also ships a local browser dashboard with an executor overview, a patch view and a watch that flags any change made at the desk since your last snapshot.

## How to set it up

1. Enable Telnet on the grandMA2 or grandMA2 onPC session you'll control.
2. Clone the repo, run `uv sync` with Python 3.12 or newer, copy `.env.template` to `.env` and set the console IP.
3. Start the server over stdio and add it to Claude Desktop, VS Code or another MCP client.
4. Optionally run the browser UI on localhost to watch playback, patch and agent runs as they happen.
5. Practice on onPC with a copy of the show file before you point it at a show console.

Source project: [drohi-r/grandma2-mcp](https://github.com/drohi-r/grandma2-mcp)

## FAQ

### Where did it come from?
It's a hardened fork of an earlier grandMA2 onPC MCP project, now maintained by drohi-r.

### Can it search the grandMA2 manual?
Yes. It indexes about a thousand grandMA2 help pages. Search falls back to keywords if you don't add an embeddings token.

### Does it work with grandMA3?
No, it targets grandMA2. For MA3, see the separate grandMA3 entries in this directory.
