---
title: "Tested: Claude reads and renames channels on a real Behringer X32"
slug: tested-claude-reads-and-renames-x32-channels-on-a-real-console
category: "Audio"
tools: ["Behringer X32", "Claude Desktop", "MCP", "OSC"]
difficulty: Intermediate
tested_on_rig: "2026-10-19"
rig: "a Behringer X32 with a Dante card and a laptop running Claude Desktop"
source_url: https://github.com/pmaillot/X32-Behringer
summary: "On a real X32, Claude Desktop read channel names, fader levels and all 16 mix buses through an x32-mcp-server over OSC, then renamed a channel and put it back. Every read matched the console."
rig_photos:
  - src: /rig/2026-10-19/x32-ch1-dj-left.jpg
    alt: "Behringer X32 channel screen showing channel 1 named DJ Left"
    caption: "Channel 1 on the console. Claude reported the same name."
  - src: /rig/2026-10-19/x32-ch5-rack-aux.jpg
    alt: "Behringer X32 channel screen showing channel 5 named Rack Aux"
    caption: "Channel 5, Rack Aux, matched Claude's read."
  - src: /rig/2026-10-19/claude-x32-buses.jpg
    alt: "Claude Desktop listing mute state and fader level for all 16 X32 mix buses"
    caption: "Claude reading mute and fader for all 16 mix buses."
  - src: /rig/2026-10-19/x32-ch8-aos-test.jpg
    alt: "Behringer X32 screen showing channel 8 renamed to AOS Test by Claude"
    caption: "Write test: Claude renamed channel 8 to AOS Test. It was reverted afterwards."
---

## What it does

This is a bench test on real hardware, run on October 19, 2026. A laptop on the same network as a Behringer X32 (fitted with a Dante card) ran Claude Desktop with an x32-mcp-server. The server talks to the console over OSC on UDP port 10023, the X32's standard remote-control port.

Three checks, all passed:

- **Read channels.** Claude read channel names and fader levels for the input channels. Every name and level matched what the console screen showed.
- **Read mix buses.** Claude read the mute state and fader level of all 16 mix buses.
- **Write.** Claude renamed channel 8 to "AOS Test". The new name appeared on the console, and Claude then set it back to the original name.

The practical takeaway for an AV team: an assistant can do read-only checks (names, levels, mutes) against a live desk reliably, and writes work too. Treat writes like any remote change to a console: test on a non-show scene first.

## How to set it up

1. Put the laptop and the X32 on the same network and note the console's IP address.
2. Install an x32-mcp-server and add it to Claude Desktop's MCP config with the console IP. It uses OSC on UDP port 10023.
3. Restart Claude Desktop so it loads the server.
4. Start with reads: ask for channel names and fader levels and compare them with the console screen.
5. Ask for the mute state and faders of all 16 mix buses.
6. Try one harmless write, such as renaming an unused channel, confirm it on the desk, then revert it.

## FAQ

### Does this need internet at the console?
The OSC traffic stays on the local network between the laptop and the X32. Claude Desktop itself needs its normal connection to run the assistant.

### Is it safe during a show?
Reads are low risk. Writes change the live console, so keep them to rehearsal or a test scene until you trust your setup.
