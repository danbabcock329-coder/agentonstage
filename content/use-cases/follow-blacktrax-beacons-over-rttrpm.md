---
title: "Follow BlackTrax beacons over RTTrPM"
slug: follow-blacktrax-beacons-over-rttrpm
category: "Lighting"
tools: ["BlackTrax", "RTTrPM", "TouchDesigner"]
difficulty: Advanced
source_url: https://rttrp.github.io/RTTrP-Wiki/BlackTrax.html
labels: ["Commercial product"]
summary: "BlackTrax sends RTTrPM at 100Hz. Big-endian float signature 0x4334 marks motion. Standby sets context to 0xFFFFFFFF. Lighting defaults to 238.210.10.3:6456."
---

## What it does

The RTTrP wiki's BlackTrax page describes how the BlackTrax tracking system uses Real-Time Tracking Protocol. RTTrPM carries motion. RTTrPL carries lighting. The page says BlackTrax uses both to talk to lighting, media servers, robotic cameras, and spatial audio, for automated lights and projection mapping. The protocol page says one RTTrP packet holds either RTTrPL output modules or RTTrPM trackable modules, not both. The shared header's integer signature is `0x4154` for big-endian integers and `0x5441` for little-endian. The float signature for RTTrPM is `0x4334` big-endian or `0x3443` little-endian. RTTrPL uses `0x4434` big-endian or `0x3444` little-endian. Header version in that table is `0x0002`.

BlackTrax sends RTTrPM at a fixed 100Hz. If the current frame has no beacon or LED data, the default is a heartbeat: an RTTrP header with an RTTrPM signature and no trackable payload. The context field is the current BlackTrax chapter, such as `0x00000001`, including on a heartbeat. In standby the context field is `0xFFFFFFFF`. The RTTrPM page lists the current motion version as 2.4.2.0, compatible with BlackTrax 2.6.0, and says position is relative to the origin the user defined. It does not name a unit for the coordinate doubles.

A beacon can have up to three LEDs. BlackTrax tracked-point indexes are `0x01`, `0x02`, or `0x03`. Centroid modules are the center of those LEDs. On the RTTrPM page the centroid module type is `0x02`, its size field is 29, and X, Y, and Z are doubles. Latency is milliseconds, and `0xFFFF` means overflow. Euler orientation from BlackTrax always uses order `0x0123`, which that page labels X1, Y1, Z1. The RTTrPM Euler module says those rotations are in radians. A zone submodule is sent only while the trackable is inside that zone. If the submodule is absent, the trackable is outside the zone.

The same BlackTrax page prints two lighting defaults and does not print a destination address for the RTTrPM motion stream. Lighting packet output is UDP multicast `238.210.10.3:6456`. Lighting synchronization is UDP multicast `238.210.10.4:6457`. A hold time of `0x00` means the peer should not release a channel on its own, because BlackTrax may hold it for a long time. The page says a lighting-sync request from the peer is not currently implemented.

TouchDesigner's BlackTrax CHOP, described on the wiki's TouchDesigner page, receives RTTrPM. The modules named there are trackable with and without timestamp, centroid position, tracked-point position, centroid acceleration and velocity, tracked-point acceleration and velocity, and Euler orientation. That page says TouchDesigner uses little endian and the stage coordinate system.

## How to set it up

1. In TouchDesigner, add a BlackTrax CHOP. The wiki says that node receives RTTrPM and uses little endian and the stage coordinate system. Confirm the modules you need are in the list above before you build a look that depends on quaternion orientation or zone names. Those two are not in the TouchDesigner list.
2. For a listener of your own, read the first two 16-bit fields. Integer signature `0x4154` is big-endian and `0x5441` is little-endian. Float signature `0x4334` or `0x3443` is RTTrPM. `0x4434` or `0x3444` is RTTrPL. Header version `0x0002` is the value in the current header table.
3. Treat context `0xFFFFFFFF` as standby. Any other context on that page is the chapter number, and a heartbeat uses the same chapter value with an empty motion payload. The motion rate on the BlackTrax page is 100Hz.
4. Read a centroid from module type `0x02`: a latency in milliseconds, then three doubles. Read a beacon LED from a tracked-point module whose index is `0x01`, `0x02`, or `0x03`. If a zone submodule is missing, the page says that zone is not in collision.
5. Join `238.210.10.3` port 6456 for the lighting output and `238.210.10.4` port 6457 for the lighting sync only when you are following DMX from BlackTrax. The BlackTrax page does not print the motion stream's destination. Take that address from the BlackTrax system you are listening to.

Source: [RTTrP wiki, BlackTrax](https://rttrp.github.io/RTTrP-Wiki/BlackTrax.html), [RTTrP header](https://rttrp.github.io/RTTrP-Wiki/), [RTTrPM](https://rttrp.github.io/RTTrP-Wiki/RTTrPM.html), and [TouchDesigner](https://rttrp.github.io/RTTrP-Wiki/TouchDesigner.html).

## FAQ

### Which signature is motion?
RTTrPM's float signature is `0x4334` in big-endian and `0x3443` in little-endian. RTTrPL uses `0x4434` and `0x3444`. One packet carries motion modules or lighting modules, not both.

### What does standby look like on the wire?
The BlackTrax page says the context field is `0xFFFFFFFF` in standby. During a chapter it is the chapter value, including when the packet is only the heartbeat header.

### Where is the motion port written?
The BlackTrax page prints the lighting multicast addresses and does not print a destination for the RTTrPM motion stream. The TouchDesigner page describes the BlackTrax CHOP and does not print a port either.
