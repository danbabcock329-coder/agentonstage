---
title: "Preview and program Companion buttons from an AI assistant"
slug: preview-and-program-companion-buttons-from-an-ai-assistant
category: "Show Control"
tools: ["Bitfocus Companion", "Stream Deck", "MCP"]
difficulty: Intermediate
source_url: https://github.com/drohi-r/companion-mcp
summary: "A 53-tool MCP server lets an assistant read, preview, style and press Bitfocus Companion buttons, with snapshots and rollback before a page goes onto a Stream Deck."
---

## What it does

This MCP server sits on Bitfocus Companion's HTTP API and its websocket tRPC endpoint so an assistant can work on the button grid the crew actually presses. The read side lists surfaces, pages and buttons, searches by label or connection, and pulls custom variables and module variables. The write side can press, hold, release and rotate controls, restyle text and colors, and label a whole page from a list of names.

The useful part for show prep is the gate in front of those writes. Preview tools resolve a style batch, a label grid or a button template and show the result before Companion changes. Verified press and style tools then poll until the preview or the runtime state actually moves, because the README notes that Companion can accept a write and repaint the button a moment later. Snapshots, diffs, style presets and a transaction that saves a rollback checkpoint first give you a way back if a page comes out wrong.

A small browser UI on the same machine runs the same checks, for an operator who would rather click a grid than dictate tool calls. The default target is Companion on 127.0.0.1 port 8000, and hosts outside loopback stay blocked until you add them.

## How to set it up

1. Clone the repo, then `uv sync` and `uv run python -m companion_mcp`. Companion needs to be running. The server uses HTTP for button actions and style writes, and websocket tRPC at `/trpc` for discovery, preview and variables.
2. Leave `COMPANION_WRITE_ENABLED` at its default of `1` only on a rig you are willing to change. Set it to `0` when you want reads and previews with writes blocked. `COMPANION_ALLOWED_HOSTS` defaults to loopback; add a LAN address explicitly if Companion is on another machine.
3. Point Claude Desktop, Cursor, VS Code or Codex at `uv run --directory /path/to/companion-mcp python -m companion_mcp`, and set `COMPANION_HOST` and `COMPANION_PORT` if they are not 127.0.0.1 and 8000.
4. Ask for a page inventory or a preview before the first style write. When you do write, prefer the verified style and press tools, and keep a snapshot so you can restore the page.
5. Optional: `uv run companion-mcp-ui` serves a local operator page at `http://127.0.0.1:8088`.

Source project: [drohi-r/companion-mcp](https://github.com/drohi-r/companion-mcp)

## FAQ

### What does the assistant actually change?
Button text, colors and other style fields, presses and encoder turns, custom variables, and batched page layouts. It can also rescan USB surfaces. It programs Companion. The downstream cues still belong to whatever module that button fires.

### How do I undo a bad page?
Save a page inventory snapshot or use the style transaction, which stores a checkpoint before it writes. Restore tools and `rollback_page_style_transaction` put the saved styles back. Preview the restore before you apply it.

### Is this Bitfocus's own server?
No. It is an Apache-2.0 project that talks to Companion's current HTTP and tRPC APIs. The same author publishes MCP servers for grandMA2, Resolume, MADRIX and Pangolin BEYOND.
