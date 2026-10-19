---
title: "Run ChamSys MagicQ playbacks from an assistant"
slug: run-chamsys-magicq-playbacks-from-an-assistant
category: "Lighting"
tools: ["ChamSys MagicQ", "MCP"]
difficulty: Advanced
source_url: https://github.com/ssalinas/MagicQ-MCP
labels: ["Experimental"]
summary: "MagicQ-MCP sends ChamSys Remote Ethernet Protocol commands so an assistant can run playbacks, set channels and record programmer looks on a MagicQ console or on MagicQ PC."
---

## What it does

MagicQ-MCP is an MCP server that drives a ChamSys MagicQ console, or MagicQ on a PC or Mac, with the ChamSys Remote Ethernet Protocol. Playback tools activate, release, go, stop, set a fader level from 0 to 100, jump to a cue, change page, and hit test or untest. A direct tool sets one DMX channel. Programmer tools select heads or groups, set intensity and attributes, include palettes, clear the programmer, and record cues or position, colour and beam palettes. `program_look` builds and records a look in one call. `send_raw_command` sends a CREP string.

The README is explicit about what remote control cannot do. Cue stacks have to exist on the console already. Patching stays on the console. Fade times on recorded cues are not set from here. The programmer is shared state, so a look built by the assistant is the same programmer the operator sees. Without a hardware wing, MagicQ PC and Mac only accept playbacks 1 through 10.

## How to set it up

1. On the console, set Setup → View Settings → Network → Ethernet Remote Protocol to `ChamSys Rem (tx + rx no header)`, and Playback Sync Port to `6553`. Under Setup → Multi Console, set Enable Remote Control to Yes and Net Session Mode to None.
2. Clone the repo, then `npm install` and `npm run build`. Node.js 18 or newer. Point an MCP client at `node /path/to/MagicQ-MCP/dist/index.js`.
3. Set `MAGICQ_IP` to the console address. The default is the broadcast address `255.255.255.255`, `MAGICQ_PORT` defaults to 6553, and `MAGICQ_TRANSPORT` defaults to `udp`. The README suggests TCP when you want a more reliable session. `MAGICQ_CMD_DELAY_MS` defaults to 75 between chained commands.
4. Register palette names the assistant should know. `declare_palette` adds one, or `import_palettes_csv` reads a CSV of type, id and name (`colour`, `position` or `beam`). That registry is a local `palettes.json`, not a download of the show file.
5. Clear the programmer before and after a look. The README says the programmer is shared, and a leftover selection will ride into the next record.

Source project: [ssalinas/MagicQ-MCP](https://github.com/ssalinas/MagicQ-MCP)

## FAQ

### Does MagicQ PC need a wing?
The requirements line asks for a console or for MagicQ PC/Mac with a hardware wing attached. The limitations section then says that without a wing, PC and Mac only support playbacks 1 through 10. Patch, stack creation and cue fade times stay on the console either way.

### Where do the command strings come from?
The README points at ChamSys's remote control command chapter for the underlying protocol: [Remote Control Commands](https://secure.chamsys.co.uk/docs/magicq/manual/remote_control_commands.html).
