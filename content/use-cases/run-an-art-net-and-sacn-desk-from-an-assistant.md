---
title: "Run an Art-Net and sACN desk from an assistant"
slug: run-an-art-net-and-sacn-desk-from-an-assistant
category: "Lighting"
tools: ["Art-Net", "sACN", "DMX", "MCP", "QLC+"]
difficulty: Advanced
source_url: https://github.com/bawaaaaah/light-mcp-server
labels: ["Experimental"]
summary: "light-mcp-server 0.1.0 is a v0 Art-Net 4 and sACN desk, up to 16 universes, with the same command layer for the web UI, MIDI, OSC and an MCP client, plus show safety rules."
---

## What it does

light-mcp-server is an open-source DMX controller. The README, which is in French, calls the project in development at v0. `package.json` on that repo is version 0.1.0, name `@bawaaaaah/light-mcp-server`, license MIT, and it requires Node.js 22.6 or newer. Output is Art-Net 4, with node discovery, and sACN, up to 16 universes.

One command layer serves the web UI, MIDI, OSC, MCP, a timeline and a CLI. Looks are written on an abstract canvas and then rendered onto each room's rig. The virtual stage (zones, heights, orientations, roles) is readable by the assistant. Step techniques and waveform effects can follow a BPM. Groups can nest, carry a proportional master, be exclusive, and have limits.

The safety rules named in the README are forbidden modes, a maximum UV level, protected zones, scenes with no intensity, a strobe policy, a neutral Panic and Blackout. Panic uses a fallback look chosen in the show. The install notes say that without that look, Panic is a blackout.

A QLC+ `.qxw` can be imported. The install guide says fixtures, the canvas, looks (not exact), exclusive groups, masters and MIDI mappings are created, keeping the same MIDI notes. Recognized looks can be rebuilt into editable techniques when the render stays faithful. This is a different path from driving QLC+ itself, or from programming DMX through OLA.

The published package is on GitHub Packages (`publishConfig.registry` is `https://npm.pkg.github.com`), and the install doc also lists a GHCR image and a Mac menu-bar app. The README's status line still says v0.

## How to set it up

1. Clone the repo and, on the machine that will run it, `npm install`, then `npm --prefix web install`, then `npm run build`. Node.js 22.6 or newer matches `package.json`. On npm 12 or newer the install doc also runs `npm install-scripts approve esbuild @julusian/midi` and rebuilds those two packages. Docker is `docker compose up -d --build`, with data in `./data`.
2. Create a user PIN with `npm run light -- pin regisseur 1234`. The install notes say a role name creates the user for that role. Start the built server with `npm start`. The UI is on port 8790. Sign in with the token from `npm run light -- token`, or with a user's PIN. The token is not written into the logs.
3. MCP over HTTP is `http://<machine>:8790/mcp` with `Authorization: Bearer` set to that token. The README's Claude Code example is `claude mcp add --transport http light http://<machine>:8790/mcp --header "Authorization: Bearer VOTRE_JETON"`. The UI page Connexion IA prints the address, the token and the steps for Claude Code, Claude Desktop, claude.ai, stdio, MCP Inspector and curl.
4. For stdio, with the HTTP server not already running on the same data, the README's command is `node dist/cli/main.js serve --stdio --no-http`. It says not to run that while the HTTP server is up on the same files, because the show would have two writers.
5. Put QLC+ fixture definitions (`.qxf`) in `data/fixtures/`, then use Import on the `.qxw`, read the proposal, and apply it. In Show, pick the fallback look for neutral Panic. Art-Net discovery uses port 6454. The install notes say to set `"discovery": false` when this Mac is shared with QLC+, and to run standby (`npm run serve -- --standby`) while only one of the two should be transmitting.

Source project: [bawaaaaah/light-mcp-server](https://github.com/bawaaaaah/light-mcp-server)

## FAQ

### Is this safe to open on a show LAN as-is?
The README says the token controls the lighting, so keep it secret. PINs are limited to 5 wrong tries a minute per address once `trustProxy` is set. For a client off the LAN it tells you to put HTTPS in front, set `server.publicUrl`, and prefer a security key over a PIN. The project is still marked v0.

### Can the assistant and the web UI edit the same show?
Yes, when both use the HTTP server. The rights of the token are the administrator's, and the show rules apply to the assistant the same way they apply to the UI. A second stdio process on the same data is the case the README tells you to avoid.

### Where do shows live?
Under `data/`, which git ignores. The install guide lists `machine/`, `venues/`, `shows/`, `fixtures/`, `imports/`, `private/`, `exports/` and `backups/`. Each object is a JSON file, and saves keep the previous version.
