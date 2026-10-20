---
title: "Tested: Claude drives an RGBW par through an ENTTEC DMX USB Pro"
slug: tested-drive-an-rgbw-par-from-claude-through-an-enttec-dmx-usb-pro
category: "Lighting"
tools: ["ENTTEC DMX USB Pro", "Chauvet RGBW par", "Claude Desktop", "MCP", "DMX"]
difficulty: Intermediate
tested_on_rig: "2026-10-19"
rig: "a Chauvet RGBW par at DMX address 1, driven by an ENTTEC DMX USB Pro on a Windows laptop (COM3)"
source_url: https://www.enttec.com/
summary: "A small, no-dependency MCP server let Claude Desktop set colors on a real Chauvet RGBW par through an ENTTEC DMX USB Pro, with set_color, set_rgbw and blackout tools."
rig_photos:
  - src: /rig/2026-10-19/rgbw-par-red-dmx.jpg
    alt: "Chauvet RGBW par lit red, driven over DMX from an ENTTEC DMX USB Pro"
    caption: "First DMX test: channel 1 full, the par lights red."
---

## What it does

This is a bench test on real hardware, run on October 19, 2026. A Chauvet RGBW par at DMX address 1 (four channels: red, green, blue, white) was connected to an ENTTEC DMX USB Pro on the laptop's COM3 port.

A small MCP server, written with no third-party dependencies, writes DMX frames to the ENTTEC and gives Claude Desktop three tools:

- **set_color**: a named color plus a brightness, for requests like "make it purple at 50%".
- **set_rgbw**: raw red, green, blue and white levels.
- **blackout**: all channels to zero.

All three worked on the fixture. Because the X32 MCP server was loaded at the same time, Claude could also combine them, for example checking a console channel and then setting the light.

## How to set it up

1. Connect the ENTTEC DMX USB Pro and find its serial port (COM3 in this test).
2. Address the fixture. Here the par was at DMX address 1 in a 4-channel RGBW mode.
3. Send one test frame with channel 1 at full. The par should go red, which confirms the port, cable and address.
4. Add the DMX MCP server to Claude Desktop's config next to any other servers, then restart Claude Desktop.
5. Ask for a color and brightness, then ask for a blackout.

## FAQ

### Do I need lighting software?
Not for a single fixture. The server writes DMX straight to the ENTTEC. For a real rig with many fixtures, a lighting console or OLA is the better base.

### Can I get the script?
The scripts are site-specific (port, address, channel layout), so they are not published here yet. The approach above is the full design: open the serial port, send ENTTEC "Output Only Send DMX" frames, expose three tools.
