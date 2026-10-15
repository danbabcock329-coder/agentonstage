---
title: "Chase SMPTE, MTC and Art-Net timecode in Companion with TimeCore"
slug: chase-smpte-mtc-and-art-net-timecode-in-companion-with-timecore
category: "Show Control"
tools: ["Bitfocus Companion", "Visual Productions TimeCore", "Timecode"]
difficulty: Intermediate
source_url: https://bitfocus.io/connections/visualproductions-timecore
summary: "The TimeCore module brings a Visual Productions TimeCore into Companion, so buttons and triggers can show and react to incoming timecode."
---

## What it does

The TimeCore module brings a Visual Productions TimeCore into Companion, so buttons and triggers can show and react to incoming timecode.

## How to set it up

1. Add the Visual Productions TimeCore connection in Companion and point it at the device.
2. Show variables such as $(…:tc_smpte) or tc_mtc on buttons for a timecode readout.
3. Use the Receiving feedbacks to flag when the timecode source drops.
4. Use actions to start, stop or set internal timecode and timers.

Source: [Bitfocus connection docs](https://bitfocus.io/connections/visualproductions-timecore)

## FAQ

### Which sources are reported?
SMPTE/LTC, MTC, Art-Net, RTP-MIDI, sACN, TCP and UDP.

### Does it need hardware?
Yes, a TimeCore device.
