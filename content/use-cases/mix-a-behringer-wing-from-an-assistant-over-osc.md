---
title: "Mix a Behringer WING from an assistant over OSC"
slug: mix-a-behringer-wing-from-an-assistant-over-osc
category: "Audio"
tools: ["Behringer WING", "OSC", "MCP"]
difficulty: Advanced
source_url: https://github.com/bawaaaaah/wing-mcp-server
labels: ["Experimental"]
summary: "wing-mcp-server speaks the WING's OSC and metering protocols so an assistant can mix, process and patch the desk, with dry-run, undo and an optional show mode that blocks audible writes."
---

## What it does

wing-mcp-server is an MCP server and a web dashboard for a Behringer WING, WING Rack or WING Compact. The README says it speaks the console's own OSC control protocol and its binary metering stream, and that it exposes the desk as 134 typed tools. The same actions are available by hand in the React dashboard.

The surface covers faders, mutes, pan, sends, main assigns, DCAs and mute groups on channels, auxes, buses, mains and matrices. Processing includes EQ, gate and dynamics, including the per-model controls of the compressor and gate emulations. Auto-gain, auto-compress and auto-gate drive the desk's real controls from live meters. A pink-noise auto-EQ for matrix, bus and main strips can use measurement-mic calibration files. Presets can be saved, loaded and deleted over any part of the node tree, and scenes and libraries are reachable. Other named areas are input patching, inserts, processing order, solo and monitor, talkback, scribble strips, bus lighting, GPIO, the USB player, RTA and metering, and OSC mirroring.

Writes are read back. The README says a generic or identity write returns `MISMATCH`, not `OK`, when the console stored something else. A write can be dry-run, is journaled with its previous value for `wing_undo`, and says whether it is audible. An optional show mode refuses audible writes unless they are explicitly confirmed.

This is a different project from the C library `wapi`. The README calls it a personal project, built and tested against a single WING, and says to expect rough edges on any model or firmware it has never met. The license file is MIT. Music Tribe's WING protocol PDF is not in the repo.

## How to set it up

1. You need Node.js 22.6 or newer and a WING the machine can reach, or the built-in simulator. From a checkout, copy `.env.sample` to `.env`, set `WING_HOST` to the console IP, then `npm install` and `npm run dev`. `npm run fake-wing` starts a simulated desk on this machine; point `WING_HOST` at `127.0.0.1` to try the dashboard without hardware. The README says the simulator is for the dashboard, not a model of console behaviour.
2. The published image is `ghcr.io/bawaaaaah/wing-mcp-server`. The README's shortest Docker line publishes dashboard port 8787 and UDP 14135, mounts a data volume, and sets `WING_HOST`. The npm package `@bawaaaaah/wing-mcp-server` is on GitHub Packages, not the public npm registry, and needs a GitHub token. Either way the dashboard is on `PORT` (8787 by default) and MCP is at `/mcp`.
3. The auth token is generated on first boot and is not printed in the logs. Read it with `wing-mcp-server --print-token`. Under Docker the README uses `docker exec` against `node dist/cli.js --print-token`. For Claude Code over HTTP, the example is `claude mcp add --transport http wing http://192.168.1.10:8787/mcp --header "Authorization: Bearer YOUR_TOKEN"`. The dashboard's Connect page fills in a snippet for the client you are using.
4. A local stdio client can spawn the process itself. The README's Claude config uses `npx` with `-y`, `@bawaaaaah/wing-mcp-server`, `--stdio`, `--no-http`, and an absolute `--config` path. The working directory is the client's, so a relative `./data/config.json` can land somewhere unexpected. Closing the client ends a stdio server.
5. `WING_HOST` and the related variables only seed `data/config.json` on the first boot. After that they are ignored. The full tool list is about 26,000 tokens. The dashboard Tools page, and `docs/configuration.md`, can turn families off. The README says the `core` profile alone cuts that to about 7,300 tokens.

Source project: [bawaaaaah/wing-mcp-server](https://github.com/bawaaaaah/wing-mcp-server)

## FAQ

### Does show mode stop every change?
No. The README says show mode refuses audible writes unless you confirm them. Reads, and writes it does not class as audible, are a separate path. Dry-run still touches nothing.

### Can I point this at a WING Compact on a show without a trial?
The README says it was tested against a single WING and to expect rough edges on other models or firmware. `npm run fake-wing` is the no-hardware trial, and it is not a behavioural model of the desk.

### Is the protocol manual included?
No. Comments cite `docs/WING_Remote-Protocols-3.1-03.pdf` by page. The README says that PDF is Music Tribe's manual, is not redistributed, and is not covered by the MIT license. Download it from Behringer's WING product page if you want those page references locally.
