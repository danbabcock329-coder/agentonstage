---
title: "Drive MADRIX LED shows from an assistant over Remote HTTP"
slug: drive-madrix-led-shows-from-an-assistant-over-remote-http
category: "LED/Video"
tools: ["MADRIX", "MCP"]
difficulty: Advanced
source_url: https://github.com/drohi-r/madrix-mcp
summary: "An MCP server that talks to MADRIX over its Remote HTTP interface for storage, cue lists, timelines, groups, layers and output, with lab, show-safe and read-only profiles."
---

## What it does

An MCP server that talks to MADRIX over its Remote HTTP interface for storage, cue lists, timelines, groups, layers and output, with lab, show-safe and read-only profiles.

## How to set it up

1. Clone the repo, then `uv sync` and `uv run python -m madrix_mcp`. Enable MADRIX Remote HTTP. Defaults are host `127.0.0.1`, port `80` and path `/RemoteCommands/`.
2. The default `MADRIX_SAFETY_PROFILE` is `lab` (read/write, no extra confirm). For a show, set `show-safe` so destructive actions need `confirm=true`, or `read-only` to block writes. `MADRIX_READ_ONLY=1` and `MADRIX_CONFIRM_DESTRUCTIVE=1` are the matching flags.
3. Only loopback hosts are allowed until you add the MADRIX machine to `MADRIX_ALLOWED_HOSTS`. The README says to use LAN or WireGuard, not the public internet.
4. Register it with Claude Desktop, VS Code, Cursor or Codex using the `uv run --directory` example in the README, and point `MADRIX_HOST` at the MADRIX machine.

Source project: [drohi-r/madrix-mcp](https://github.com/drohi-r/madrix-mcp)

## FAQ

### How wide is the tool set?
The README describes 108 tools, including raw `get_remote` and `set_remote` escape hatches that still pass through the same safety checks. Official Remote HTTP docs are linked from the repo.

### Has it been pointed at a real MADRIX?
The README says it was checked against a live MADRIX instance for health, product, cue list, storage, audio, output, timeline and group reads, plus `set_master`, `set_fade_value` and a group write via `SetGroupValue`.
