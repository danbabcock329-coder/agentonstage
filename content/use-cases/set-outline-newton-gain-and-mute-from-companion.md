---
title: "Set Outline Newton gain and mute from Companion"
slug: set-outline-newton-gain-and-mute-from-companion
category: "Audio"
tools: ["Outline Newton", "Bitfocus Companion", "TCP"]
difficulty: Intermediate
source_url: https://github.com/bitfocus/companion-module-outline-newton/blob/main/companion/HELP.md
labels: ["Commercial product"]
summary: "Companion sends Newton commands on TCP 6668 and reads meters on UDP 6667. Gain writes stay inside -80 to +6 dB. Snapshots need firmware 0.98."
---

## What it does

Bitfocus Companion's Outline Newton module HELP describes control of the Newton audio matrix from a Companion surface. Commands, configuration reads, and snapshot traffic go to the Newton over TCP port 6668. Real-time meter and status requests use UDP port 6667. The operating system picks Companion's local UDP reply port. If UDP 6667 is blocked, the HELP says TCP control still works, meters and the priority and clock monitors stay `N/A`, and the module logs a warning.

Channel numbers on the surface are 1-based. The module converts them to Newton's 0-based indices before it sends. The conversion table is Input DSP and Output DSP `1..16` to `0..15`, Aux Mixer `1..10` to `0..9`, Matrix Mixer `1..288` to `0..287`, and Trimmer and Output Group `1..64` to `0..63`.

Level Up and Level Down change gain by a chosen amount from 0.1 to 24 dB per press and keep the current mute. Set Gain and Mute State writes a fixed value. Every gain the module writes is hard-clamped to `-80..+6` dB, and the HELP says values outside that window never reach the device. Gain and mute feedback is refreshed from the complete audio-preset payload, which the HELP names `0x21`, while at least one Levels and Mute feedback is in use. Before a relative gain or mute write, Companion reads the current state and serializes presses on that channel. The display is `--` until the first read, or while the connection is down.

Apply Snapshot needs firmware 0.98 or later. The module reads the firmware when it connects. On older firmware, the HELP's example is 0.97, snapshot actions are disabled, the button label shows `NO SNAPSHOT / FW < 0.98`, and `$(outline-newton:snapshot_support)` reads `Unsupported by firmware`. The other features keep working. The Newton operating manual's cover, document review 1.9.1, lists device firmware 0.97, which is the firmware this module treats as too old for snapshots.

Meters are Input DSP or Output DSP, peak or RMS, channels 1 through 16. Below `-60` dB the bar is dark. From `-60` to `-40` only the blue signal LED lights. From `-40` to `0` dB the bar runs green, yellow, and red, turning yellow at `-12` dB and red at `-6` dB.

## How to set it up

1. Add the Outline Newton connection in Companion and set Device IP Address to the Newton. Leave the interactivity profile on Default until the surface is too slow or too chatty. Changing the profile recreates the UDP meter socket and does not restart the TCP session.
2. Confirm TCP 6668 and UDP 6667 are open from Companion to the Newton. Connection Status should read `NEWTON ONLINE`. If it is online and the meters stay `N/A`, the HELP says to check the UDP path. TCP control can still be working.
3. Read a channel before the first move. Channel Gain shows a line such as `GAIN IN 3 / -6.0 dB`, or `MUTED`. Channel Mute toggles mute and keeps the current gain.
4. Use Level Up or Level Down for a relative move of 0.1 to 24 dB. Use Set Gain and Mute State for a fixed value, and stay inside `-80` to `+6` dB. The module clamps anything outside that window.
5. Apply a snapshot only after `$(outline-newton:snapshot_support)` reads `OK`. On firmware older than 0.98 the snapshot actions are disabled. Run Refresh Snapshot Database after snapshots are added, renamed, or removed outside Companion.

Source: [Outline Newton Companion HELP](https://github.com/bitfocus/companion-module-outline-newton/blob/main/companion/HELP.md) and the [Newton operating manual](https://outline.it/download/Documents/Manuals/Newton/Newton_operating_manual.pdf).

## FAQ

### Does a meter request use the same port as a gain write?
No. The HELP sends commands, configuration reads, and snapshots to TCP 6668. Meter and status requests use UDP 6667. Blocking 6667 leaves TCP control working and leaves the meters at `N/A`.

### Will firmware 0.97 take a snapshot from this module?
The HELP says snapshots require firmware 0.98 or later, and that 0.97 disables the snapshot actions with the label `NO SNAPSHOT / FW < 0.98`. Gain, mute, meters, and the priority rearm actions are the features it says keep working.

### Are Companion's channel numbers the indexes on the wire?
The surface is 1-based. The module sends the 0-based index in its conversion table. Input 1 is index 0. Matrix mixer 288 is index 287.
