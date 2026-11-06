---
title: "Edit a Pro Tools session from an assistant over PTSL"
slug: edit-a-pro-tools-session-from-an-assistant-over-ptsl
category: "Audio"
tools: ["Avid Pro Tools", "PTSL", "MCP"]
difficulty: Intermediate
source_url: https://github.com/BlueElevatorProductions/protools-mcp
summary: "A local MCP server edits a live Pro Tools session over PTSL on macOS port 31416. Write tools confirm before they run."
---

## What it does

protools-mcp is a local MCP server that connects Claude, or another MCP client, to a Pro Tools session that is already open. The README says it talks to PTSL on `localhost:31416` on macOS. It was built for podcast post, and the README says the same tools apply to music, broadcast, and audio post.

The README describes 25+ tools in seven groups. Session context reads the session name, path, sample rate, markers, and track list, and can return a snapshot plus a matched show profile. Track tools return an EDL, playlists, and the clips in a timecode range. Transcript tools read a Pro Tools Speech-to-Text CSV, search it, and return a time range as speaker-labeled lines. Navigation reads the playhead and the selection, and can move the playhead.

Edit tools select a region, create a marker, mute, unmute, solo, and consolidate. Consolidate writes a new audio file on disk. Session tools save, save as, open, and close. Export writes an AAF. The README labels the write tools `[WRITE]` and says Claude describes the operation and confirms before it runs.

Show profiles are optional JSON files in `show_profiles/`. The README says they hold per-show names, track roles, and naming, and that the server matches a profile from the session name prefix. The license is MIT.

The README's prerequisites are macOS, Pro Tools running with a session, Python 3.11 or newer (it says tested with 3.11), and py-ptsl. AAF export automates a Pro Tools dialog, and that step needs Accessibility permission for the app that is running the server. Without it, the README's error table includes a `dialog_waiting` result that needs someone to confirm the dialog by hand.

## How to set it up

1. On the Mac, open Pro Tools and load the session you mean to edit. PTSL listens on `localhost:31416`. The README's `.env` defaults are `PTSL_HOST=localhost` and `PTSL_PORT=31416`.
2. Install Python 3.11 or newer and py-ptsl. Clone the repo, create a virtualenv with `--system-site-packages` so that install is visible, and `pip install -r requirements.txt`.
3. Register the venv's Python and `server.py` with the MCP client. The README's Claude Desktop example points `mcpServers` at those two paths. For Claude Code it uses `claude mcp add` with the same command. The server connects on the first tool call, not at launch.
4. Grant Accessibility to Claude Desktop or the terminal under System Settings, Privacy & Security, Accessibility, if the assistant will export an AAF. The README says that permission is what lets the bridge dismiss the Pro Tools folder dialog.
5. Ask for a session snapshot before any edit. Put a Speech-to-Text CSV next to the session, or set `transcript_export_path` in a show profile, before you ask for a transcript search. Leave consolidate, save-as, close, and AAF until the `[WRITE]` confirmation matches the session you have open.

Source project: [BlueElevatorProductions/protools-mcp](https://github.com/BlueElevatorProductions/protools-mcp)

## FAQ

### Which writes does the README mark?
Select, marker, mute, unmute, solo, and consolidate, plus save, save as, open, close, and AAF export. The README labels those `[WRITE]` and says Claude confirms before executing. Consolidate creates a new audio file.

### Does this run on Windows?
The README specifies macOS and PTSL on `localhost:31416`. It does not describe a Windows setup.

### Where does the transcript come from?
A Pro Tools Speech-to-Text CSV next to the session, or the path in a show profile. The README says the server reloads that file when it changes. There is no transcript until that export exists.
