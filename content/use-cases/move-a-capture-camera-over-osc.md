---
title: "Move a Capture camera over OSC"
slug: move-a-capture-camera-over-osc
category: "Lighting"
tools: ["Capture", "OSC"]
difficulty: Intermediate
source_url: https://www.capture.se/Manual/en-UK/2026/Appendix.html
labels: ["Commercial product"]
summary: "Capture 2026 takes OSC 1.0 and 1.1 on port 4004. /view/live/position recalls a camera. Omitted time is an instant move. /ping returns /pong."
---

## What it does

Capture's 2026 Reference Manual, appendix section 20.4.3, documents OSC as an automation protocol. Capture accepts OSC 1.0 and 1.1 over TCP and over UDP. The default port is 4004. Address patterns are not supported, and OSC bundles are not supported. Verbose logging can be turned on for troubleshooting. The same appendix lists OSC separately from Art-Net, sACN, CITP, and the console links. A camera command in this section moves a view inside Capture. It is not a DMX output command.

`/ping` returns `/pong` with two strings, the product name and the version. `/getCatalogs` returns `/catalogs` with one int32 per numbered catalog. `/catalog/{n}/getName` returns `/catalog/{n}/name` plus the name string. `/catalog/{n}/getPositions` returns the position numbers in that catalog. `/catalog/{n}/position/{m}/getName` returns that position's name. The manual's example is `/catalog/2/position/3/getName`, the name of position 3 in catalog 2.

A view is addressed as `0`, `1`, `2`, or `live`. Indexes 0, 1, and 2 are the Alpha, Beta, and Gamma views. `live` means the first view currently in live mode, the one with the lowest index. `/view/live/getStatus` returns `/view/live/status` with an int32 index from -1 to 2, then six floats: camera X, Y, and Z, then focus X, Y, and Z. An index of -1 means no view is in live mode.

`/view/{0-2|live}/position` takes a catalog number and a position number, each an int32 from 1 to 255. Three further floats are optional: time from 0 to 600 seconds, dampening from 0 to 1, and curvature from 0 to 1. The manual says the omitted defaults are time 0, which it calls an instant transition, dampening 0, and curvature 0. You can send catalog and position alone, or add time, or add time and dampening, or add all three.

View properties are separate messages. `/view/live/bloom` with float 0.3 is the manual's example for 30% bloom on the first view that is in live mode. Bloom's range is 0 to 2, which the manual labels 0% to 200%. Exposure adjustment is a float from -3 to 3, in exposure values. Automatic exposure is a bool. White balance is a float from 2500 to 10000.

## How to set it up

1. Send OSC 1.0 or 1.1 to Capture on port 4004, over UDP or TCP. Send one message at a time. The manual says address patterns and bundles are not supported, so a wildcard path or a bundled packet is outside this section.
2. Send `/ping` and read `/pong`. The two strings are the product name and the version. Then send `/getCatalogs` and `/catalog/{n}/getPositions` before you recall a number you have not read.
3. Send `/view/live/getStatus`. If the index is -1, the manual says no view is in live mode. Address Alpha, Beta, or Gamma as `/view/0`, `/view/1`, or `/view/2` when you need a specific view. `live` always means the lowest-index view that is in live mode.
4. Recall catalog 2, position 3, on that live view with `/view/live/position` and the integers 2 and 3. With no further arguments the transition time is 0 seconds. Add a time in seconds, from 0 to 600, when the move should be visible. Dampening and curvature stay at 0 unless you append them after the time.
5. Treat this as the visualizer camera. The protocol tables in section 20.4.1 are the console links. A position message here does not replace an Art-Net or sACN level.

Source: [Capture 2026 Reference Manual, appendix 20.4](https://www.capture.se/Manual/en-UK/2026/Appendix.html).

## FAQ

### Can one packet carry the ping and the camera move?
The manual says OSC bundles are not supported, and address patterns are not supported. Send `/ping`, read `/pong`, then send the position message on its own.

### What does live point at?
Indexes 0, 1, and 2 are Alpha, Beta, and Gamma. `live` is the lowest-index view currently in live mode. `/view/live/getStatus` returns index -1 when none of the views is in live mode.

### What time is an instant cut?
The position section says an omitted time defaults to 0 seconds, and it calls that an instant transition. The allowed time is 0 to 600 seconds. Dampening and curvature default to 0 when they are omitted, and both run from 0 to 1 when they are sent.
