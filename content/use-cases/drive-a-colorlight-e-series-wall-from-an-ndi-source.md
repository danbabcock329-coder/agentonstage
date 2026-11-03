---
title: "Drive a Colorlight E-series wall from an NDI source"
slug: drive-a-colorlight-e-series-wall-from-an-ndi-source
category: "LED/Video"
tools: ["NDI", "Colorlight", "Raspberry Pi"]
difficulty: Advanced
source_url: https://github.com/quadjojo/ndi2colorlight
labels: ["Experimental"]
summary: "ndi2colorlight 0.1 pulls an NDI 6 source and paints a Colorlight E-series card with raw Ethernet. The author tested an E120 at 384×128 and says the protocol is reverse-engineered."
---

## What it does

Tobias Wessely's ndi2colorlight is a Linux command-line bridge. It receives an NDI stream and sends pixels to a Colorlight E-series receiver card with raw `AF_PACKET` Ethernet, not with IP. The README calls it a working alpha, version 0.1, tested on a Raspberry Pi with a Colorlight E120 and a 6 by 4 grid of 64 by 32 panels, which is 384 by 128 pixels. The same note says most of the code was written with an LLM in short sessions, that it is not hardened or production-tested, and that the constants come from packet captures.

The path in the README is NDI source, NDI receiver, scale plus BGR conversion, then the Colorlight sender. NDI audio frames are dropped. The pipeline is 8-bit BGR. There is no HDR or 10-bit path, and the README says there is no OSC or MIDI remote control yet. Z-series cards use a different protocol and are not supported. Other E-series cards that speak the same Layer-2 protocol are described as likely, and the author asks for an issue report if you try one.

Frames are raw Ethernet with no EtherType. The destination MAC is `11:22:33:44:55:66`. Byte 12 is the packet type: `0x55` for pixels, `0x01` for sync, `0x0A` for brightness. A frame is one or more pixel packets followed by a sync packet. The README's own timing note is a small delay between rows and about 5 ms after the last row. Brightness packets stay in the card until power is cycled. The payload cap is 497 pixels, which the README says is what keeps each packet near a 1500-byte MTU. Leave the MTU at 1500.

The link does not need an IP address. A direct cable from the host to the receiver is the simple case. A switch in the middle has to pass that unknown unicast and not rate-limit it. The README's bandwidth figure for the tested wall is about 50 Mbit/s of pixel data at 60 fps, so that NIC should not also carry the normal LAN. A USB Ethernet adapter on its own interface is the setup the author describes for a Pi.

`wall.conf` sets the grid. The example defaults are panel width 64, panel height 32, 6 panels across, 4 down, brightness 100 on a 0–100 scale, and gamma 1.0. The README calls gamma 2.2 a typical display curve. Output resolution is the panel count times the panel size.

## How to set it up

1. Use Linux with `AF_PACKET`. The README lists Raspberry Pi OS, Debian, and Ubuntu. Install `gcc`, `make`, and the NDI SDK 6 for Linux, with headers in `/usr/local/include` and `libndi.so.6` visible to the dynamic linker. The SDK is a separate Vizrt download.
2. Clone the repo and run `make`. The binary is `./ndi-led-cli`.
3. Copy `wall.conf.example` to `wall.conf` and set the panel grid. Put the receiver on its own Ethernet interface.
4. Run `sudo ./ndi-led-cli --list` to print NDI sources for 5 seconds. Then run it with `--source`, `--interface`, and `--config`. `--brightness` overrides the file. `sudo` is there because raw sockets need `CAP_NET_RAW`. The README also shows `sudo setcap cap_net_raw+ep ./ndi-led-cli` so later runs can skip `sudo`.
5. `sudo ./install.sh eth1 "MY-NDI-SOURCE"` is the non-interactive installer. It copies the binary to `/usr/local/bin/`, writes `/etc/ndi-led-wall/wall.conf` only if that file is not already there, and enables the `ndi-led-wall` systemd unit. Stop output with `systemctl stop ndi-led-wall`.

Source project: [quadjojo/ndi2colorlight](https://github.com/quadjojo/ndi2colorlight).

## FAQ

### Is this a Colorlight or NDI product?
No. The README says the project is not affiliated with Colorlight Cloud Tech or with Vizrt. NDI is a Vizrt trademark, and the SDK is installed separately under Vizrt's own license.

### Will it drive a Z-series receiver?
The README says no. Only E-series was verified, and the tested card is an E120.

### Can an assistant change brightness live?
Not over OSC or MIDI. The README says remote control is not implemented. Brightness is the `brightness` key in `wall.conf`, or the `--brightness` flag, sent as `0x0A` packets that the card keeps until it loses power.
