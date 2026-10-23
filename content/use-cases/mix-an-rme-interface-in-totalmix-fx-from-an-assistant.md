---
title: "Mix an RME interface in TotalMix FX from an assistant"
slug: mix-an-rme-interface-in-totalmix-fx-from-an-assistant
category: "Audio"
tools: ["RME TotalMix FX", "OSC", "MCP"]
difficulty: Advanced
source_url: https://github.com/huddx01/totalmix-mcp
labels: ["Experimental"]
summary: "totalmix-mcp drives TotalMix FX 2.1 or newer over Global OSC, so an assistant can set levels, mute, solo, EQ, dynamics, and snapshots on an RME interface."
---

## What it does

totalmix-mcp is an MCP server and a Claude skill for RME TotalMix FX. The README says it uses the Global OSC protocol added in TotalMix FX 2.1, and that the older banked addresses under `/1/` are a different protocol. The server checks each address against a protocol map, sends it over UDP, and keeps a cache of the state TotalMix pushes back. The skill holds the mixing rules: dB, 0-based indexes, stereo pairs, routing, submixes, EQ, dynamics, and monitoring. The server README calls the server beta: in real use, with a few protocol details still being checked on hardware.

Five tools do the work. `send_osc_commands` sends one or more messages. Level addresses take dB, from +6 down to -64.5, and -300 means off. Unknown or read-only addresses are rejected one by one. `get_channel` asks TotalMix to resend a channel, waits, and returns that index from the cache. `osc_read` reads addresses already in the cache. `get_channel_names` lists names per bus from the cache. `osc_sync` asks for everything (`/sendall`) or for settings (`/sendsettings`). The README's address examples include `/output/0/volume` and `/mix/in/2/0/fader`.

The skill's reference layout is a Fireface UFX III. The README says the protocol map itself covers TotalMix FX more generally, and that reports from other interfaces are welcome. The server is per channel index. For a stereo pair, the server README says the left channel is master for most parameters, with room EQ and gains called out as exceptions, and that the skill is where that rule is applied.

Two install paths share that server. Claude Code can install the plugin, which bundles a stdio copy. A long-running HTTP daemon is the other mode: one OSC socket and one cache, so several clients do not each open the listen port. The license file is MIT.

## How to set it up

1. Use an RME interface and TotalMix FX 2.1 or newer. In TotalMix, open Options, then Settings, then the OSC tab. Enable a remote controller, mark it In Use, and select Global OSC. The README's defaults are incoming port 7001 on TotalMix and replies to port 9001 on the controller.
2. In that remote's detailed settings, turn Send changes on, turn Follow Submix off, set Bandwidth Limitation to None, and turn on both Re-send received and Re-send if different. The README says Follow Submix can aim a mix address at a different submix than the one you named. Receive to hidden channels stays on if those channels should remain controllable.
3. For Claude Code, the README's install is `/plugin marketplace add huddx01/totalmix-mcp` and then `/plugin install totalmix`. Set `TOTALMIX_HOST` when TotalMix is on another machine. Node.js 18 or newer is the version that path asks for.
4. For Claude Desktop, download `totalmix-mcp.mcpb` and `totalmix-skill.zip` from the latest GitHub release. Open the mcpb file, then upload the skill zip under Settings, Capabilities, Skills. The README says both pieces are required.
5. The HTTP daemon lives in `server/`. Copy `.env.example` to `.env`. The sample binds OSC send to `127.0.0.1` port 7001, listens on 9001, and serves MCP on `127.0.0.1` port 8765 with a bearer token. Empty the token only for local development. `npm install`, `npm run build`, and `npm start` bring it up. `/health` is open and reports cache size. `/mcp` requires the token.

Source project: [huddx01/totalmix-mcp](https://github.com/huddx01/totalmix-mcp)

## FAQ

### Why would the cache come back short after startup?
The server README says a cold `/sendall` can overflow the operating system's UDP receive buffer, so values never reach the cache and no error is raised. It asks for a 4 MiB buffer by default, and 16 MiB on a Raspberry Pi it detects. Leaving TotalMix's OSC bandwidth limit on is the alternative that slows the burst down. After a fresh start, compare `/health` with the size of the mix.

### Do I need the skill if the server is connected?
The server README says the server forwards addresses and dB values and does not carry mixing rules. Channel layout, stereo pairs, and how a headphone mix is built live in the skill. The plugin install includes both. The Desktop install is two downloads for the same reason.
