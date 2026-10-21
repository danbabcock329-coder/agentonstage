---
title: "Build a TouchDesigner network from a tox in the project"
slug: build-a-touchdesigner-network-from-a-tox-in-the-project
category: "TouchDesigner"
tools: ["TouchDesigner", "MCP"]
difficulty: Intermediate
source_url: https://github.com/johnsabath/touchdesigner-mcp
summary: "Drop td_mcp_server.tox into a TouchDesigner 2024 project and an assistant can create operators, run Python, and grab a PNG, GIF or MP4 of the output on port 9988."
---

## What it does

This MCP server runs inside TouchDesigner. The README's quick start is to drag `td_mcp_server.tox` into the project. The server listens on port 9988. Point an MCP client at `http://localhost:9988/mcp`. The tox is self-contained. There is no path to configure and no extra install inside TouchDesigner.

The tools in the README are `run` (execute Python; expressions return values, multi-line code captures stdout), `inspect` (channels, parameters, errors, connections), `set` (parameters as constants or expressions), `create` (an operator with position, parameters, expressions and wiring in one call; `nodeX` and `nodeY` are required), `wire` (batch connections, with input indexes that increment), `read`, `write` and `edit` for Text DATs, `list` (operators under a container, filterable by family or pattern), `docs` (parameters, menus, defaults and connectors for an operator type), `observe` (a PNG snapshot or an animated GIF of the current output), `render` (an MP4 through TouchDesigner's own recording, with optional audio and an automatic or manual start and stop) and `map` (a text map of the network with connections, positions and non-default parameters).

It implements MCP Streamable HTTP as JSON-RPC POST on a Web Server DAT. The README says there are no external dependencies, and the root operator is found with `me.parent()`. A manual setup, if you skip the tox, is a Web Server DAT on port 9988 set Active, a Text DAT filled from `scripts/td_mcp_server.py`, and the Web Server DAT callbacks pointed at that Text DAT. Requirements are TouchDesigner 2024 or newer and any MCP client. The README's license section says MIT.

The repo also ships a Claude Code skill at `.claude/skills/touchdesigner-building/` that the README says loads for operator, shader and parameter work when you are in this project. Copy that folder into another project's `.claude/skills/` if you want the same notes there, and point that project's `.mcp.json` at the running server.

## How to set it up

1. Install TouchDesigner 2024 or newer and open the project you want the assistant to edit.
2. Drag `td_mcp_server.tox` from the repo into the network. The README says the server starts on port 9988 by itself.
3. In the MCP client, set the server URL to `http://localhost:9988/mcp`. The README links the Claude Code, Cursor and Windsurf MCP setup pages for where that URL goes. Restart the client if it only reads servers at launch.
4. Ask for `list` or `map` before `create`. `create` needs `nodeX` and `nodeY`. `run` executes Python in the project, so keep the first prompts to inspection until you trust the session.
5. Use `observe` to pull a PNG or GIF of the output back into the chat, and `render` when you want an MP4 from TouchDesigner's recorder. Stop the tox, or turn the Web Server DAT off, when you do not want a client on that machine creating operators.

Source project: [johnsabath/touchdesigner-mcp](https://github.com/johnsabath/touchdesigner-mcp)

## FAQ

### Does this replace Derivative's TDMCP or a bridge that runs outside TouchDesigner?
No. Those are other servers. This one is a component inside the `.toe`. Quit TouchDesigner and the port goes with it.

### What leaves the machine?
The README serves MCP on localhost port 9988. `observe` returns an image of the current output to the client, and `run` can execute whatever Python the client sends. Do not publish that port.

### Which TouchDesigner builds does the README claim?
TouchDesigner 2024 or newer. The manual path uses a Web Server DAT, which is part of TouchDesigner, and the README says the tox adds no external dependencies.
