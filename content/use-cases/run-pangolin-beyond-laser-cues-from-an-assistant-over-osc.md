---
title: "Run Pangolin BEYOND laser cues from an assistant over OSC"
slug: run-pangolin-beyond-laser-cues-from-an-assistant-over-osc
category: "Lighting"
tools: ["Pangolin BEYOND", "OSC", "MCP"]
difficulty: Advanced
source_url: https://github.com/drohi-r/beyond-mcp
summary: "An MCP server sends Pangolin BEYOND cues, zones, brightness and safety limiters over OSC, with lab, show-safe and read-only profiles in front of a fire-and-forget laser output."
---

## What it does

This MCP server gives an assistant 117 tools across 20 groups for Pangolin BEYOND, all sent as OSC. The set covers cue start and stop, page and tab navigation, master brightness, blackout, BPM, zone mute and brightness, geometric correction, projector alignment, effects, and the safety limiter. A raw OSC send and a bundle send cover addresses the named tools skip, and preview tools print the packet without transmitting it.

BEYOND's OSC input is UDP. The server sends the datagram and continues. The README is direct about what that means on a laser show: there is no acknowledgement and no rollback, so every call is a real action. Safety is a profile you pick at startup. `lab`, the default, allows writes and does not demand an extra confirm. `show-safe` still allows writes and requires `confirm=true` on destructive calls such as blackout, stop-all, workspace load and zone stops. `read-only` leaves only config, health and the two preview tools.

The author says the repo was exercised against a real BEYOND over LAN, and names the calls that behaved on that build: `display_popup`, `set_bpm`, next and previous page and tab, start and stop cue by name, and `set_master_brightness`. On that same pass, `load_cue` went out cleanly and did not produce an obvious visible change, and `display_preview("main", ...)` did not match the preview name on that workspace. Treat the rest of the tool list as implemented and range-checked, and prove the ones you care about in the venue before they are anywhere near an audience.

## How to set it up

1. In BEYOND, enable OSC input. The server's default receive port is 12000 (`BEYOND_OSC_PORT`).
2. Clone the repo, `uv sync`, and start it with `uv run python -m beyond_mcp`. For a show machine set `BEYOND_SAFETY_PROFILE=show-safe`. Use `read-only` until you have confirmed the network path.
3. The host allowlist is loopback unless you add the BEYOND machine to `BEYOND_ALLOWED_HOSTS`. For a remote machine use LAN or WireGuard, allow UDP to the OSC port, and set `BEYOND_HOST`. The README says to keep this off the public internet.
4. Register it in Claude Desktop, Cursor, VS Code or Codex with the `uv run --directory` example, then follow the README's first-run order: server config, health check, a popup, BPM, page and tab moves, a non-critical cue, then master brightness.

Source project: [drohi-r/beyond-mcp](https://github.com/drohi-r/beyond-mcp)

## FAQ

### Which calls were checked on a live BEYOND?
The live-validation notes name `display_popup`, `set_bpm`, page and tab navigation, `start_cue_by_name`, `stop_cue_by_name` and `set_master_brightness`. They also say `load_cue` and a preview named `main` did not show the expected result on that workspace.

### Can it turn the output off?
Yes. Named tools include blackout, disable laser output, and stop-all with a few fade behaviours. Under `show-safe`, or with `BEYOND_CONFIRM_DESTRUCTIVE=1`, those destructive calls need `confirm=true`. The limiter tool is separate and sets the safety limiter type.

### Does a successful tool call mean the laser moved?
The server can tell you the packet was sent. BEYOND does not answer over this UDP path, so a sent packet is the confirmation you get. Watch the BEYOND UI, with output disabled, the first time you try a command.
