---
title: "Mixer-agnostic MCP control with editable mapping profiles"
slug: mixer-agnostic-mcp-control-with-editable-mapping-profiles
category: "Audio"
tools: ["X32/M32", "WING", "OSC", "MCP"]
difficulty: Intermediate
source_url: https://github.com/bulyaki/ConsoleMCP
summary: "ConsoleMCP uses user-editable profiles so the same agent workflow can target several console families over OSC."
---

## What it does

ConsoleMCP uses user-editable profiles so the same agent workflow can target several console families over OSC.

## How to set it up

1. Pick an implementation (C++20 or TypeScript/Node); both use the same profile format.
2. Select or edit a JSON mapping profile for your console, then set up the console's OSC network per the README.
3. Run the smoke test, then connect it to Claude or ChatGPT.
4. Use console.snapshot before experimenting so you can console.restore.

Source project: [bulyaki/ConsoleMCP](https://github.com/bulyaki/ConsoleMCP)

## FAQ

### Why profiles?
Each command in the profile becomes an MCP tool, so you can support new consoles by editing JSON.

### Is there a raw escape hatch?
Yes, console.raw_osc. The README has a section on security and operational boundaries; read it before using it live.
