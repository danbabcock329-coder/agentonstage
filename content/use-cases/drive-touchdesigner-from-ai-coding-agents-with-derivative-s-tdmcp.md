---
title: "Drive TouchDesigner from AI coding agents with Derivative's TDMCP"
slug: drive-touchdesigner-from-ai-coding-agents-with-derivative-s-tdmcp
category: "TouchDesigner"
tools: ["TouchDesigner", "MCP", "coding agents"]
difficulty: Intermediate
source_url: https://github.com/TouchDesigner/TDMCP
labels: ["Experimental"]
summary: "An MCP server published under the TouchDesigner GitHub org that lets coding agents control a live TD session."
---

## What it does

An MCP server published under the TouchDesigner GitHub org that lets coding agents control a live TD session.

## How to set it up

1. Drop the TDMCP component into your project; the server runs inside TouchDesigner (default http://127.0.0.1:13316/mcp).
2. On the component's MCP page pick your client under Install For (Claude Code by default) and an Install Scope.
3. Copy the generated Add MCP command (e.g. `claude mcp add --transport http --scope local touchdesigner http://127.0.0.1:13316/mcp`) and run it in your project folder, then pulse Install Skills.
4. Run `claude mcp list` to confirm it shows Connected, then ask the agent about your network.

Source project: [TouchDesigner/TDMCP](https://github.com/TouchDesigner/TDMCP)

## FAQ

### Which clients work?
Claude Code, Codex, Antigravity, OpenCode and any client that speaks streamable-HTTP MCP.

### What can the agent do?
26 tools: create and wire operators, set parameters, read DATs, inspect runtime values and look up TD docs. It is labelled beta.
