---
title: "Set a Blackmagic SmartView border and brightness over Ethernet"
slug: set-a-blackmagic-smartview-border-and-brightness-over-ethernet
category: "LED/Video"
tools: ["Blackmagic SmartView", "TCP"]
difficulty: Intermediate
source_url: https://documents.blackmagicdesign.com/UserManuals/SmartViewManual.pdf
labels: ["Commercial product"]
summary: "SmartView Ethernet Protocol v1.4 is text on TCP port 9992. Read the state dump, then set brightness or a soft tally. Hardware tally overrides that border."
---

## What it does

The Blackmagic SmartView and SmartScope user manual includes the SmartView Ethernet Protocol v1.4, released with SmartView 1.4 software. It is a text status and control protocol, described as similar in structure to the Videohub protocol. A client connects to TCP port 9992 on a SmartView or SmartScope. On connection the monitor sends a complete state dump. After that, state changes are sent asynchronously.

Blocks have an identifying header followed by a colon. A block can span lines and ends with a blank line. The manual's legend marks the line ending it prints as a carriage return. A client should ignore a block it does not recognize, up to the blank line, and ignore unrecognized lines inside a block it does know.

The first block is `PROTOCOL PREAMBLE:` with `Version: 1.4`. The next is `SMARTVIEW DEVICE:`. The manual's SmartView Duo example includes `Model: SmartView Duo`, `Hostname:`, `Name:`, `Monitors: 2`, and `Inverted: false`. `Inverted` means the monitor has detected that it is mounted upside down.

Numeric display values are 0 through 255. Contrast and saturation are zero-centered, and the manual says the normal value is 127, so the picture matches the original. Above 127 increases contrast or saturation. Below 127 decreases it. The brightness example is separate from that sentence. To set brightness to what the manual calls 50 percent and to desaturate the image to black and white, it prints:

```
MONITOR A:
Brightness: 127
Saturation: 0

```

That block ends with a blank line. One or more of those parameters can be sent in the same block. `WidescreenSD: ON` is the command the manual gives for standard-definition video in 16:9. `WidescreenSD: OFF` is the command it gives for 4:3.

`Identify: true` on a monitor block shows a white border around the picture for 15 seconds and then resets. The manual says that border temporarily overrides any other border. `Border` sets the soft tally to one of RED, GREEN, BLUE, WHITE, or NONE. The worked example is `MONITOR B:` with `Border: green`. The hard-wired tally on the DB-9 always overrides the soft tally, and the full state report shows the border that is actually in effect.

On a SmartScope Duo 4K, `ScopeMode` selects the display. The manual lists AudioDbfs, AudioDbvu, Histogram, ParadeRGB, ParadeYUV, Picture, Vector100, Vector75, and WaveformLuma. `Picture` is the video-monitor mode. For audio metering, `AudioChannel: 0` is channels 1 and 2, and the list continues by pairs through `7` for channels 15 and 16.

The `NETWORK:` block can switch DHCP on with `Dynamic IP: true`, or set a static address by sending `Dynamic IP: false` together with `Static address`, `Static netmask`, and `Static gateway`. Lines prefixed `Current` are read-only. The manual says changing the name or any network setting drops the IP connection, and the monitor restarts networking.

## How to set it up

1. Open TCP to the monitor on port 9992. Read until the blank line after `SMARTVIEW DEVICE:`. Keep `Version:` from the preamble, and use `Monitors:` before you address a second screen.
2. Read the existing `MONITOR A:` block, and `MONITOR B:` when the device reports two monitors, before you write. The state dump is the manual's picture of what is on the screen, including the border that hardware tally may already be overriding.
3. To set the manual's 50 percent brightness example and remove color, send `MONITOR A:`, then `Brightness: 127`, then `Saturation: 0`, then a blank line. Contrast is the zero-centered control. Brightness in that example is 127 out of the 0-255 range.
4. For a soft tally, send `Border:` with one of the listed colors. The manual's example is lowercase `green` on `MONITOR B:`. Remember that a contact closure on the tally port replaces it, and `Identify: true` covers it with white for 15 seconds.
5. Do not send a `NETWORK:` write from an unattended session. The manual says a name or network change drops the connection and restarts networking.

Source: [Blackmagic SmartView and SmartScope user manual](https://documents.blackmagicdesign.com/UserManuals/SmartViewManual.pdf), SmartView Ethernet Protocol v1.4 section.

## FAQ

### Is brightness 127 the same idea as contrast 127?
The manual says contrast and saturation are zero-centered and that 127 leaves the picture looking like the original. The brightness sentence is the example labeled 50 percent, and that example also uses 127. Both sit in the 0-255 range the protocol section gives for numeric values.

### Will Border: green win over the tally connector?
No. The manual says the hard-wired tally always overrides the soft tally. The state report shows the border that is currently valid, so a later read is the check, not the command you just sent.

### Which scope names are on a SmartView Duo?
`ScopeMode` is in the SmartScope Duo 4K section. The listed values are AudioDbfs, AudioDbvu, Histogram, ParadeRGB, ParadeYUV, Picture, Vector100, Vector75, and WaveformLuma. Picture is the video-monitor mode.
