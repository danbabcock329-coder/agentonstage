---
title: "Edit an LED and DMX timeline with Show Designer"
slug: edit-an-led-and-dmx-timeline-with-show-designer
category: "Lighting"
tools: ["Show Designer", "Art-Net", "sACN", "DMX", "MCP"]
difficulty: Intermediate
source_url: https://github.com/guillegar/show_designer
summary: "Show Designer Pro is a headless Python lighting app with a browser timeline and 3D view. Its MCP server forwards 62 tools to a WebSocket bridge on port 9876 so an assistant can edit the show."
---

## What it does

Show Designer Pro is a lighting program for LED strips and DMX fixtures. The engine is headless Python. A React page in the browser is the timeline, the patch, the live view and a Three.js preview. The README says audio plays on the PC as the master clock, and that the same backend exposes JSON-RPC so an assistant can drive the show.

Documented outputs are Art-Net (per-universe unicast), sACN E1.31 (unicast or multicast) and an ENTTEC Open DMX USB device via `pyserial`. Fixture profiles are GDTF or JSON. Routing from a universe to a target lives in `output_targets.json`, separate from the rig. The README's quick start is Windows 10 or 11 with Python 3.11 or newer. It says Linux and macOS are not guaranteed. Node 18 or newer is only needed if you rebuild the frontend. The built UI is already in `web/dist`.

The repo's `.mcp.json` starts `python -m src.mcp.mcp_show_server` over stdio. That module connects to `ws://127.0.0.1:9876` and forwards each tool as JSON-RPC. `server/main.py` describes that port as the MCP-compatible bridge. On 21 October 2026 the module marked 62 functions with the MCP tool decorator. They cover transport (`play`, `pause`, `stop`, `seek`, `blackout`, `get_state`), clips, channel clips, fixtures and the rig, cue slots, groups, saving and loading a show, and audio-analysis helpers such as `analyzer_find_drops`. `generate_section` takes a start, a duration and a style. The MCP guide's style names are `energetic`, `subtle`, `synchronized`, `random` and `audio_reactive`.

The project README describes the same bridge as 150 or more JSON-RPC commands. The MCP guide says 50 or more tools. The count checked in `src/mcp/mcp_show_server.py` is the 62 decorators above. The license in the repo is Prosperity Public License 3.0: the README says personal, educational and open-source use is free, and commercial use needs a license, with a 30-day trial stated there.

## How to set it up

1. On Windows, clone the repo, create a virtualenv with Python 3.11 or newer, activate it, and `pip install -r requirements.txt`. Start the app with `python -m server.main`. The README says the UI is then at `http://localhost:8000`. `Luces.bat` is the Windows launcher that restarts cleanly and opens the browser.
2. Leave that process running. The stdio MCP server only forwards calls. If nothing is listening on port 9876, a tool returns a bridge error instead of editing the show. The MCP guide's connection-refused note says the app crashed or port 9876 is already taken.
3. Claude Code, opened in the repo, reads `.mcp.json`. The server name there is `show-control`, the command is `python`, and the args are `-m` and `src.mcp.mcp_show_server`. The MCP guide says to start Claude Code after Show Designer is already up, and that the tools show up as `mcp__show-control__*`.
4. Ask for a read first, such as the current state or the fixture list, before `add_clip` or `generate_section`. `blackout` and `play` hit the running show. `save_show` writes it.
5. Output targets are not the same file as the rig. Edit `output_targets.json` for which universe goes to WLED, an Art-Net node, sACN or the USB widget. The hardware guide linked from the README is `docs/hardware.md`.

Source project: [guillegar/show_designer](https://github.com/guillegar/show_designer)

## FAQ

### Does the assistant talk to the fixtures by itself?
No. The stdio process opens a WebSocket to `127.0.0.1` port 9876 and the Show Designer process does the Art-Net, sACN or USB output. Stop the app and the tools have nothing to forward to.

### Which tool count should I plan context around?
Use the MCP server you actually launch. The file `.mcp.json` points at `src.mcp.mcp_show_server`, which currently decorates 62 tools. The README's "150+" figure is about JSON-RPC commands on that bridge, and the MCP guide's figure is "50+".

### Can I use this on a paid gig?
The README says Prosperity Public License 3.0 allows personal, educational and open-source use, and that commercial use needs a license. It also says that license includes a 30-day trial. Read `LICENSE` in the repo before a paid show.
