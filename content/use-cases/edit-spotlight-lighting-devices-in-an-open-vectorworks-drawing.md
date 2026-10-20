---
title: "Edit Spotlight lighting devices in an open Vectorworks drawing"
slug: edit-spotlight-lighting-devices-in-an-open-vectorworks-drawing
category: "Lighting"
tools: ["Vectorworks Spotlight", "MCP"]
difficulty: Advanced
source_url: https://github.com/giorgiomoroder/vectorworks-mcp
labels: ["Experimental"]
summary: "A beta MCP server lets Claude read and bulk-edit Spotlight lighting devices in an open Vectorworks 2026 drawing on macOS, then undo that last edit."
---

## What it does

vectorworks-mcp lets Claude work inside the Vectorworks drawing you already have open. The README is Spotlight-first: channels, addresses, purposes, colors, gobos and positions. It can also run any Vectorworks Python when the typed tools are not enough. It is pure Python, with no C++ SDK and nothing to compile. The README marks it beta, tested on Vectorworks 2026 Update 3, English, on macOS only. Other versions, languages and Windows may not work. The Windows installer exists and is described as experimental and untested: it registers Claude Desktop, but there is no automatic trigger, so you run MCP Run Job yourself for each request.

The lighting tools are `vw_list_lighting_devices` (unit, channel, address, purpose, position, type, color, gobo, focus and the rest of the device), `vw_set_lighting_device_fields` (bulk edit by position plus unit number, by channel, or by uuid), `vw_list_positions` (devices on each position, plus unassigned devices and position names that have no position object), and `vw_lighting_device_report` (CSV or JSON paperwork, naturally sorted). Around those are document info, layers, classes, selection, find, record read and write, symbol list and insert, `vw_revert_last`, `vw_exec_python` and `vw_vs_lookup` against the `vs` API of the Vectorworks you have installed.

Bulk edits are all-or-nothing. If any device cannot be found or any field name is wrong, nothing changes. Unit numbers repeat per position, so the position has to be included. Spotlight treats UniverseAddress, such as `2/101`, as the source of truth. Edits to Universe or DMX Address go through that field, and the tool re-reads each device and reports anything Spotlight overrode.

`vw_revert_last` undoes exactly the last Claude edit in that drawing and can be repeated. Vectorworks lumps back-to-back Claude edits into one Cmd-Z, so Cmd-Z may undo several of them and, the README says, never your own work. Changes made with `vw_exec_python` can only be undone with Cmd-Z.

Anything Claude reads from the drawing, plus what you type, is sent to Anthropic as part of the conversation. The `.vwx` file itself is not uploaded. The bridge stays on the Mac and passes jobs through `~/.vwmcp/`. The README tells you to check an NDA before using it on a confidential plot, and to limit the ask to one position or layer when you can.

## How to set it up

1. You need Vectorworks 2026 and Claude Desktop or Claude Code. On macOS, the README's installer is `curl -LsSf https://raw.githubusercontent.com/giorgiomoroder/vectorworks-mcp/main/scripts/install-macos.sh | bash`. It installs uv if needed, copies the bridge into `~/Library/Application Support/Vectorworks/2026/Plug-ins/vwmcp/`, and adds Vectorworks to Claude Desktop and Claude Code. Existing Claude Desktop settings are kept, with a backup beside them.
2. In Vectorworks, open Tools, Plug-ins, Plug-in Manager, Custom Plug-ins, New. Choose Command and name it exactly `MCP Run Job`. Edit Script, set Language to Python, and paste `from vwmcp import vwmcp_bridge` and `vwmcp_bridge.run_pending()`. Then Tools, Workspaces, Edit Current Workspace, Menus, and drag MCP Run Job from Miscellaneous into a menu such as Tools.
3. Run Tools, MCP Run Job once by hand. The README says nothing visible should happen and no error should appear, because no job is queued yet.
4. Quit and reopen Claude. With a drawing open, ask it to ping Vectorworks. The first time, macOS asks whether Claude may control Vectorworks. Allow it. The reply should include the Vectorworks version and the open drawing name. Claude waits until Vectorworks has been open about 30 seconds. Scripts sent while it is still starting can crash it.
5. For a different year, the README says to set `VW_VERSION=2025` before the installer and `VWMCP_APP="Vectorworks 2025"` in the server environment. Only 2026 is tested. If a dialog is open, the request waits and then times out. Close it and ask again. Bridge errors go to `~/.vwmcp/vwmcp.log`.

Source project: [giorgiomoroder/vectorworks-mcp](https://github.com/giorgiomoroder/vectorworks-mcp)

## FAQ

### Can it patch a console or output DMX?
No. The tools in the README read and edit the open drawing: lighting devices, positions, records, symbols and paperwork. They do not talk to a console.

### What if a field name is wrong on one unit?
The README says a bulk edit changes nothing unless every device is found and every field name is valid. Ask for `vw_revert_last` when the last typed edit needs to come back. Raw Python does not go through that undo.

### Does the drawing file get uploaded?
The README says the `.vwx` file is not uploaded, and that tool results are. Fixture lists, channels, addresses, position names and show names that a tool returns are part of the Claude conversation.
