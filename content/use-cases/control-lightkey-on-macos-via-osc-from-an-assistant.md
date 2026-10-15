---
title: "Control Lightkey on macOS via OSC from an assistant"
slug: control-lightkey-on-macos-via-osc-from-an-assistant
category: "Lighting"
tools: ["Lightkey", "OSC", "MCP"]
difficulty: Beginner
source_url: https://github.com/groundroot/lightkey-mcp
summary: "Lets an MCP client trigger Lightkey presets and cues, a simple path to AI-assisted lighting on Mac."
---

## What it does

Lets an MCP client trigger Lightkey presets and cues, a simple path to AI-assisted lighting on Mac.

## How to set it up

1. In Lightkey go to Settings → External Control and check Enable OSC (default 127.0.0.1:21600 UDP).
2. Clone, `npm install`, `npm run build`.
3. Register with `claude mcp add lightkey -- node <path>/dist/index.js`, adding LIGHTKEY_HOST/PORT env vars for a remote Mac.

Source project: [groundroot/lightkey-mcp](https://github.com/groundroot/lightkey-mcp)

## FAQ

### What can it do?
Cues, playback, palettes, fixture overrides, master/blackout and BPM, plus raw OSC.

### Language?
The README is in Korean; the commands above are the key steps.
