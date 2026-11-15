---
title: "Read a Stype HF camera track in TouchDesigner"
slug: read-a-stype-hf-camera-track-in-touchdesigner
category: "TouchDesigner"
tools: ["TouchDesigner", "Stype HF"]
difficulty: Intermediate
source_url: https://docs.derivative.ca/Stype_In_CHOP
labels: ["Commercial product"]
summary: "TouchDesigner Pro's Stype In CHOP reads Stype HF on UDP 6301. Channels include camera position, rotation, fov, zoom, focus, and k1 k2."
---

## What it does

Derivative's Stype In CHOP reads a Stype RedSpy tracker with the Stype HF protocol. The page says the operator is only in TouchDesigner Pro. It publishes channels a camera and a Stype TOP can use.

The default Network Port is 6301. The page says to set it to the hardware's output port instead of assuming the default still matches. Protocol can be UDP messaging, UDP multicast, or reliable messaging through the UDT library. For multicast, Network Address is the address Stype listens on. Local Address picks the NIC when the machine has more than one. Active off stops the update, and data that arrives while it is off is dropped.

`connected` is 1 after a valid Stype message in the last 500 ms, otherwise 0. `recording` and `focus_distance` are also 1 or 0. The page points at the Stype protocol for what those two flags mean and does not define them further. Timecode is `hours`, `minutes`, `seconds`, and `frames`, and it may be zero when the packet has no time.

`tx`, `ty`, and `tz` are camera position, for a Camera COMP's Translate. `rx`, `ry`, and `rz` are rotation, for Rotate. `fov` is the field of view, for FOV Angle. `padded_fov` is that field of view after Padding. Padding is 0 to 1 and is the fraction to add so lens distortion can sample outside the normal render. `aspect` is the camera aspect. `focus` runs from 0, closest, to 1, infinite. `zoom` runs from 0, wide, to 1, tele.

`centerx` and `centery` are the sensor offset in millimetres. `k1` and `k2` are the radial distortion terms. `pawidth` and `paheight` are the sensor size in millimetres. The page says the Stype TOP uses those six for lens correction.

An Info CHOP on the Stype In reports `valid_packets`, `unrecognized_packets`, `corrupt_packets`, `missing_packets`, `dropped_packets`, and `last_packet_num`. That is the page's way to see a bad port or a skipped packet.

## How to set it up

1. Use TouchDesigner Pro. Add a Stype In CHOP and leave Protocol on UDP messaging unless the tracker is sending multicast or you are using the reliable option.
2. Set Network Port to the tracker's output port. Use 6301 only when that is still the hardware setting. For multicast, set Network Address to the group the tracker uses. Set Local Address if the wrong NIC would otherwise take the packets.
3. Turn Active on. Read `connected`. It stays 0 until a valid message has arrived in the last 500 ms.
4. Export `tx` `ty` `tz` to the Camera COMP Translate, `rx` `ry` `rz` to Rotate, and `fov` to FOV Angle. Use `padded_fov` when Padding is above 0. Feed `centerx`, `centery`, `k1`, `k2`, `pawidth`, and `paheight` to a Stype TOP for the lens correction the page describes.
5. Attach an Info CHOP before you trust the solve. `corrupt_packets`, `missing_packets`, and `dropped_packets` are the counts the operator exposes. `last_packet_num` is the last packet number it saw.

Source: [Stype In CHOP](https://docs.derivative.ca/Stype_In_CHOP).

## FAQ

### Does this CHOP move the camera head?
No. The page describes a reader. Packets arrive on the network port, and the CHOP outputs channels. Active off discards what arrives while it is off.

### What does connected mean?
It is 1 when a valid Stype message arrived in the last 500 ms, and 0 otherwise. It is not a count of packets. The Info CHOP has the packet counts.

### Is 6301 always right?
It is the protocol default printed on the page. The same paragraph says to match the current hardware output settings.
