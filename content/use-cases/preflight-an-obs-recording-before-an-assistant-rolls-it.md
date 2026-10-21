---
title: "Preflight an OBS recording before an assistant rolls it"
slug: preflight-an-obs-recording-before-an-assistant-rolls-it
category: "LED/Video"
tools: ["OBS Studio", "obs-websocket", "MCP"]
difficulty: Intermediate
source_url: https://github.com/Tom-R-Main/OBS-MCP
summary: "OBS MCP exposes the OBS WebSocket v5 surface, including a recording preflight and a short checked take, and can start in a read-only mode that refuses every write."
---

## What it does

OBS MCP is a Node.js process between an MCP client and OBS Studio's built-in WebSocket server. It does not patch OBS or load a plugin. The README says it exposes 171 tools for scenes, sources, audio, transitions, filters, recording, streaming, canvases and the rest of the OBS WebSocket v5 requests, built against the protocol revision pinned by the OBS Studio source tree it tracks. It speaks MCP 2026-07-28 and still accepts older 2025 clients.

Tool discovery works while OBS is closed. Calls that need OBS return an error until the socket is up, and the server reconnects in the background when OBS comes back. Every tool carries read-only, destructive, idempotent and open-world annotations. A runtime check compares a call with the requests the connected OBS actually advertises.

Two recording helpers are the reason to pick this server over a smaller OBS remote. `obs-preflight` looks for the cases where OBS quietly refuses or ruins a recording. `obs-record-clip` runs that preflight, records up to 50 seconds with chapter markers, stops, and, when ffprobe or ffmpeg is installed, checks the file's length and audio. `obs-take-start`, `obs-take-mark`, `obs-take-status` and `obs-take-stop` cover a watched recording of any length. `obs-snapshot` and `obs-restore` save input and scene-item state so a later step can undo it. `obs-apply-scene` takes a description of a scene and makes OBS match it.

`OBS_MCP_READ_ONLY=true` registers only read-only tools. `OBS_MCP_CONFIRM_LIVE=true` asks before stopping or toggling a stream or a recording. The license in the repo is GPL-2.0. The README says this checkout does not yet have its own npm release.

## How to set it up

1. Use Node.js 20.19 or newer and OBS Studio 28 or newer. In OBS, open Tools, then WebSocket Server Settings, and enable the server. The README's default address is `ws://localhost:4455`. Set a password if you turn authentication on.
2. Clone `https://github.com/Tom-R-Main/OBS-MCP.git`, run `npm ci`, then `npm run check`. There is no `npx` package for this repo yet. The client command is `node` and the args are the absolute path to `build/index.js`.
3. Put `OBS_WEBSOCKET_PASSWORD` in the client's env block when OBS authentication is on. Add `OBS_WEBSOCKET_URL` only if the address is not the default. The server does not print the password. Diagnostics go to stderr so stdout stays MCP.
4. For a first session, set `OBS_MCP_READ_ONLY` to `true` and ask for the OBS version, the current scene, and whether streaming or recording is active. The README's sample prompt says not to change anything. Leave the MCP process running and start OBS if discovery works but the socket is down.
5. When you allow writes, `OBS_MCP_CONFIRM_LIVE=true` gates stop and toggle on the stream and the recording. `OBS_MCP_TOOLSETS` can limit which groups load into the model. `all` and `core` are named, plus the groups in the README's Choosing tools table. `npm run pack` builds `dist/obs-studio.mcpb` for a desktop client that opens MCPB packages. That package prompts for the WebSocket URL and password.

Source project: [Tom-R-Main/OBS-MCP](https://github.com/Tom-R-Main/OBS-MCP)

## FAQ

### Is this the same server as agentic-obs?
No. That listing is `ironystock/agentic-obs`. This one is `Tom-R-Main/OBS-MCP`, aimed at the full WebSocket v5 request list plus preflight, takes and snapshots. Use read-only mode until you mean to change the program output.

### Will a recording tool start the encoder immediately?
`obs-record-clip` preflights first, then records at most 50 seconds, then checks the file if ffprobe or ffmpeg is on the machine. `obs-preflight` by itself is the check. `OBS_MCP_CONFIRM_LIVE` is a separate switch for stop and toggle of a stream or recording.

### Can several agents share one process?
Set `OBS_MCP_HTTP_PORT` and the README serves Streamable HTTP at `http://127.0.0.1:<port>/mcp` instead of stdio. `0` picks a free port. Set `OBS_MCP_HTTP_TOKEN` if that port should require a bearer token. The bind in that table is loopback.
