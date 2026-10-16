---
title: "Fire Zero 88 ZerOS cues and macros from an AI assistant"
slug: fire-zero-88-zeros-cues-and-macros-from-an-ai-assistant
category: "Lighting"
tools: ["Zero 88 ZerOS", "Zero 88 FLX", "OSC", "MCP"]
difficulty: Intermediate
source_url: https://github.com/MaybeItsAdam/zeros-mcp
labels: ["Experimental"]
summary: "An MCP server that drives Zero 88 FLX and ZerOS Server consoles over OSC: cues, playbacks, grand master, blackout and user macros."
---

## What it does

An MCP server that lets an assistant fire cues, move playbacks, set the grand master, trigger blackout and run user macros on Zero 88 consoles running ZerOS 7.14 or later. Zero 88 documents OSC for FLX, FLX S24/S48 and ZerOS Server.

The README is honest about the limits. ZerOS only receives OSC and never sends any back, so the server can't read console state. A success means the packet left your machine, not that the desk did anything. Anything outside the documented OSC commands, like setting a channel level, is done by recording a user macro at the desk and firing it by number.

## How to set it up

1. On the console, go to Setup, then Triggers, then OSC. Enable OSC, set the Receive Port Number (the README uses 8830) and pick UDP or TCP (SLIP).
2. Install `uv`, then add the server to your MCP client with `ZEROS_IP`, `ZEROS_PORT` and `ZEROS_TRANSPORT` set to match the desk.
3. Use TCP if you can. It's the only way the server can tell whether anything is listening at that address.
4. Test against a desk with nothing patched, or one that isn't in front of an audience. Commands take effect on real lights right away.

Source project: [MaybeItsAdam/zeros-mcp](https://github.com/MaybeItsAdam/zeros-mcp)

## FAQ

### Can it tell me which cue is live?
No. ZerOS doesn't send any OSC, so there's no way to query the console. The command journal only shows what this server sent.

### Why won't a cue fire?
Playbacks start at 0, the master playback. The README notes an FLX S48 user found the cue-only address worked where the playback-plus-cue form was ignored.

### Can it program channels or colors?
Not directly. Record a user macro at the desk and fire it with the macro tool.
