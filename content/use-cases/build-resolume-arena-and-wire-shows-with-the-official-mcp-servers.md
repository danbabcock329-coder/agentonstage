---
title: "Build Resolume Arena and Wire shows with the official MCP servers"
slug: build-resolume-arena-and-wire-shows-with-the-official-mcp-servers
category: "LED/Video"
tools: ["Resolume Arena", "Resolume Avenue", "Resolume Wire", "MCP"]
difficulty: Intermediate
source_url: https://resolume.com/support/en/mcp-servers
labels: ["Commercial product"]
summary: "Resolume 7.26 and later ship MCP servers so an assistant can build Arena or Avenue compositions and Wire patches in natural language while you prepare a show."
---

## What it does

Resolume 7.26.0 and later include local MCP servers for Arena, Avenue and Wire. With the Arena server connected, an assistant can summarize the open composition, load files and sources, and add or remove effects, layers, columns and groups. Resolume describes that work as the slow part of building a composition, and says the server is used mostly while you are preparing, ahead of the performance.

The support page is explicit about the ceiling: the Arena server can do what the REST API can do, and nothing past it. It cannot create or edit slices and screens in Advanced Output, keyboard, MIDI, DMX or OSC mappings, clip cue points, presets, parameter envelopes or Dashboard dials, and it cannot record the composition or render clips. Clips and files it can see are the ones in the current deck. It can switch decks and then keep editing.

The Wire server is separate. Describe a patch and it creates the nodes, wires them, sets inlet values, renames and color-codes nodes, and can group parameters on the dashboard. Resolume says it can write ISF shaders for more complicated patches. It cannot create, manage or apply Dashboard presets, render patches, or compile patches.

## How to set it up

1. Install Resolume 7.26.0 or newer and sign in to Claude Desktop or the Codex app. The MCP files live inside the Arena and Wire application folders.
2. On macOS with Claude Desktop, double-click `resolume_arena_mcp_server.mcpb` or `resolume_wire_mcp_server.mcpb` in the app's `mcp` folder (`/Applications/Resolume Arena/mcp/` or `/Applications/Resolume Wire/mcp/`) and confirm Install.
3. On Windows with Claude Desktop, open Settings, then Extensions, then Advanced settings, then Install Extension, and choose the matching `.mcpb` under `C:\Program Files\Resolume Arena\mcp` or `C:\Program Files\Resolume Wire\mcp`.
4. For Codex, add a server whose command is the `resolume_arena_mcp_server` or `resolume_wire_mcp_server` executable in that same folder (the Windows files end in `.exe`). Start Arena or Wire, open a new thread, and ask for a composition summary or the server status before you let it edit anything. Resolume recommends the latest Opus model and says Sonnet and Haiku make more mistakes. They also say Claude Chat runs into tool limits quickly, and they recommend prompting in Cowork.

Source: [Resolume MCP servers](https://resolume.com/support/en/mcp-servers)

## FAQ

### Does Avenue have its own installer?
Resolume tells you to install the Arena/Avenue server and the Wire server. Avenue shares the Arena server. Wire has its own `.mcpb` and its own executable.

### Can it lay out Advanced Output?
The support page says slices, screens and the rest of Advanced Output are outside the REST API, so the Arena MCP server cannot build them.

### Is this the same as the community Resolume MCP servers?
No. Those are separate projects that talk to Resolume's HTTP API on their own. This one is the server Resolume ships inside the 7.26 applications.
