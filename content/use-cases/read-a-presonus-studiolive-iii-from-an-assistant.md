---
title: "Read a PreSonus StudioLive III from an assistant"
slug: read-a-presonus-studiolive-iii-from-an-assistant
category: "Audio"
tools: ["PreSonus StudioLive", "MCP"]
difficulty: Advanced
source_url: https://github.com/zarfld/presonus-studiolive-mcp
labels: ["Experimental"]
summary: "presonus-studiolive-mcp lets an assistant read a StudioLive III over the UC Surface port. Writes stay off unless you opt in, and v0.1 only claims a channel-mute write on a 32SC."
---

## What it does

presonus-studiolive-mcp is an MCP server for PreSonus StudioLive III mixers on the local network. The README marks v0.1.0 as experimental and read-mostly. An assistant can discover a mixer, check that the serial is the desk you expected, and read channel name, mute, solo, fader, pan, color, and the Fat Channel compressor and EQ model names. Further tools cover mixer capacity, a rider or input-list check, patch-sheet checks, meter activity, the current project and scene, aux mixes, and a single-channel diagnosis. The adapter wraps `@featherbear/presonus-studiolive-api` 1.9.1 and speaks the same TCP port as UC Surface.

The README's hardware table is specific. StudioLive 32SC firmware 3.3.0.109659 and 3.4.0.111374, and StudioLive 32R firmware 3.4.0.111374, are marked observed for discovery, connection, and core channel reads. Channel mute is the only write the v0.1 contract claims, and only on a 32SC, where the README says it was checked on hardware. StudioLive 24R, 16R, and 16 are listed as unverified. Fat Channel parameter values are tagged `calibrated_inferred`. Some routing fields stay `inferred` until a probe confirms them. Rename, subgroup, and aux-assignment proposals exist in the code and are described as outside the v0.1 public contract. EQ, fader, and Fat Channel writes are described as hard-disabled.

Writes are off until `PRESONUS_WRITE=1`. A mute change is a proposal (`prepare_mute_change_set`), then a check, then `apply_change_set`. The proposal expires after 60 seconds. A dry run previews the change. Applying it returns fresh state and a rollback hint, and the server logs the change on stderr.

## How to set it up

1. Use Node.js 20 or newer and pnpm 9 or newer. Clone the repo, run `pnpm install --frozen-lockfile`, then `pnpm build`.
2. Put the mixer and the computer on the same LAN. Set `PRESONUS_IP` to the mixer. `PRESONUS_PORT` defaults to 53000. Set `PRESONUS_SERIAL` to the serial from `pnpm probe:dev discover` so a second mixer on the network is not picked up silently. `PRESONUS_ROLE` is optional (`FOH`, `STAGEBOX`, `MONITOR`, or `UNKNOWN`).
3. Point Claude Desktop, or a VS Code MCP config, at `node` with the argument `<repo>/packages/presonus-mcp-server/dist/index.js`, and pass those variables in `env`. The server uses stdio.
4. Leave `PRESONUS_WRITE` unset for a read. The README's first sequence is `discover_mixers`, `validate_mixer_identity`, `refresh_mixer_state`, then the `presonus://mixer/{deviceId}/channels` resource.
5. Turn writes on only for a mute test on a 32SC you can afford to change. The README says not to enable writes during a performance unless you understand the proposal workflow.

Source project: [zarfld/presonus-studiolive-mcp](https://github.com/zarfld/presonus-studiolive-mcp)

## FAQ

### Can it move a fader?
Not in the v0.1 contract. The README lists fader, EQ, and Fat Channel write tools as deferred. The write it does claim is a channel mute, and only on a StudioLive 32SC, and only after you set `PRESONUS_WRITE=1` and apply a proposal.

### Will UC Surface stay connected?
The README says UC Surface, QMix-UC, and this server can be connected at the same time. The mixer is reached on TCP port 53000, the port the README lists for the UC Surface protocol. The computer still has to be on the same LAN segment as the mixer.
