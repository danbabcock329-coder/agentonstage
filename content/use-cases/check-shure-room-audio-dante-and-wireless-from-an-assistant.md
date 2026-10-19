---
title: "Check Shure room audio, Dante and wireless from an assistant"
slug: check-shure-room-audio-dante-and-wireless-from-an-assistant
category: "Audio"
tools: ["Shure MXA", "Shure ULX-D", "Shure QLX-D", "Dante", "MCP"]
difficulty: Intermediate
source_url: https://github.com/lutztalk/shure-mcp
labels: ["Experimental"]
summary: "shure-mcp lets an assistant read fleet health, mutes, gains, MXA talker positions, Dante status and wireless battery and RF on Shure devices you list in a local config."
---

## What it does

shure-mcp is a local MCP server for Shure installed-audio gear on the control network. Point it at a JSON list of devices and an assistant can list rooms, probe health, read status, mute or unmute, set gain, flash identify, load a preset, and read MXA talker positions. Fleet tools roll up TCP and REST reachability, latency, firmware and capabilities. Per-channel meters, Dante or AES67 status, and wireless health are separate reads. Wireless coverage in the README is QLX-D, ULX-D and Axient Digital: battery, RF frequency and signal strength, plus interference on the AD600.

The README lists twelve profiles: MXA920, MXA902, MXA910, MXA710, MXA310, P300, QLXD4D, ULXD4D, ULXD4Q, AD600, IntelliMix Room, and a conservative generic TCP profile. MXA920, MXA902 and MXA710 prefer REST and fall back to TCP. The others in that list are TCP. It does not discover devices on the network, manage Shure Designer projects, or host a remote HTTPS MCP service. It is not affiliated with Shure.

Writes are split. Typed mute, gain, identify and preset loads are allowed for normal operation. Raw GET strings are allowed. Raw SET, reboot and reset commands, and unknown mutating strings are blocked unless the matching safety flag is turned on.

## How to set it up

1. Use Node.js 20 or newer and add `npx -y github:lutztalk/shure-mcp` as an MCP server. With no config the server still starts, and the fleet tools report that nothing is configured.
2. Copy `examples/shure.config.example.json`. Set each `host` to the Shure Control IP, not the Dante audio address. The default TCP port is 2202. Put those hosts in `allowedHosts`.
3. Pass the file as `SHURE_CONFIG_PATH`. For an MXA that should answer REST, set `restBaseUrl` (the example uses `https://` plus the control IP) and `preferredApi` of `auto` or `rest`. `tls: "insecure"` is the README's option for a self-signed certificate on a trusted control network.
4. Leave `safety.allowRawSet`, `allowDestructive` and `allowUnknownMutatingCommands` at false unless you have a reason to open them. A blocked raw SET comes back with code `SAFETY_BLOCKED`.
5. Ask for fleet health or a wireless status read before the first mute. Wireless reads need a transmitter on the channel or the values are not meaningful. The README's example is a seven-device, three-room file that includes MXA920, P300, MXA710, MXA910, QLXD4D and ULXD4Q.

Source project: [lutztalk/shure-mcp](https://github.com/lutztalk/shure-mcp)

## FAQ

### Can it retune a wireless mic?
The wireless tools described in the README are reads: battery, RF frequency, signal strength, and a pre-event readiness prompt. Mute, gain, identify and preset load are the typed writes. RF coordination and Shure Designer are outside what the README claims.

### Which address do I put in the config?
The Shure Control IP. The README says a Dante-only address will not answer these control calls. If the host is missing from `allowedHosts`, the server rejects it.
