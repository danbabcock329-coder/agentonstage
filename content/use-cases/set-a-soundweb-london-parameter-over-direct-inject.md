---
title: "Set a Soundweb London parameter over Direct Inject"
slug: set-a-soundweb-london-parameter-over-direct-inject
category: "Audio"
tools: ["BSS Soundweb London", "TCP"]
difficulty: Advanced
source_url: https://help.harmanpro.com/soundweb-london-third-party-control
labels: ["Commercial product"]
summary: "Soundweb London Direct Inject listens on TCP 1023. A message starts with 0x02 and ends with 0x03. 0x8C recalls a preset with no address. A mute uses raw 0 or 1."
---

## What it does

Harman's Soundweb London third-party control guide describes the London Direct Inject protocol. A Soundweb London device answers a third-party controller that sets or reads any parameter or meter. The guide says Crown, JBL, and AKG devices do not respond to this protocol. Soundweb London is always listening. There is no enable step for third-party control.

Most devices have a 100 Mb/s RJ-45 for Ethernet control and a 9-pin D-type for RS-232. The D-type uses pins 2, 3, and 5. BLU-Link, Dante, CobraNet, and AVB are not control connections. Messages aimed at another Soundweb device are forwarded across the network. The message bytes are the same on serial and on Ethernet.

Every message starts with `0x02` and ends with `0x03`. The checksum is the XOR of the body bytes, computed before byte substitution. After the checksum is appended, `0x02`, `0x03`, `0x06`, `0x15`, and `0x1B` inside the message are replaced with `0x1B` plus `0x82`, `0x83`, `0x86`, `0x95`, or `0x9B`. On serial, a valid message is acknowledged with `0x06`. A bad checksum returns `0x15`. If the device is set to wait for an acknowledgement and neither byte arrives within 1 second, it retransmits. Those baud and acknowledgement settings are in the Audio Architect properties. Ethernet does not use that acknowledgement. Devices listen on TCP port 1023, accept multiple connections, and the guide says a controller normally opens a socket and leaves it open.

The first body byte is the type. `0x88` sets a raw value. `0x8D` sets a percentage. `0x89` and `0x8E` subscribe, raw and percent, and the current value comes back immediately as a set message, then again on each change until unsubscribe or a reboot. `0x8A` and `0x8F` unsubscribe. `0x90` bumps a percentage up or down. `0x8C` recalls a Soundweb London preset by its preset ID, and that message uses no address. A bump does not produce a set reply for a parameter you are subscribed to. Send subscribe again to read the value after a bump.

A parameter address is a node (two bytes, `0x0001` to `0xFFFE`), a virtual device (one byte: audio `0x03`, logic `0x02`), an object ID (three bytes), and a parameter ID (two bytes). The value is four bytes, signed. Percent encoding is the percentage times 65536. A two-state control such as mute uses 0 and 1, which the guide calls 0% and 100%. The gain row runs from `-280,617` (0%, −80 dB) to `100,000` (100%, +10 dB). Unity is 0, which the guide calls 73.73%. From −infinity to −10 dB the scale is logarithmic, and above −10 dB it is linear. A meter runs from `-800,000` (0%, −80 dB) to `400,000` (100%, +40 dB) on a linear scale. 0 dB is 0, which the guide calls 66.66%, and dB equals the raw value divided by 10,000.

Audio Architect builds the bytes. Add a Third-party Controller from the Controllers folder, drag a parameter or a preset onto it, pick the message type, and use Copy String. The guide says the Source Address and IP Address settings on that view are not used for London DI messages.

## How to set it up

1. Control the device on the Ethernet port or on RS-232 pins 2, 3, and 5. Leave BLU-Link, Dante, CobraNet, and AVB out of the control path. On Ethernet, open TCP port 1023 and keep the socket open. The guide allows more than one connection.
2. In Audio Architect, add the Third-party Controller and drag the gain, mute, or preset you want from Venue Explorer. Choose SET, SET PERCENT, SUBSCRIBE, or the matching unsubscribe. Presets have no message-type menu. Copy String pastes the London DI message for that entry. The guide says the Source Address and IP Address settings are not used for London DI messages.
3. Send one copied message per parameter. `0x88` is a raw write. `0x8D` is percent, with the raw percent equal to the percentage times 65536. Mute is a two-state value, 0 or 1. Recall uses `0x8C` and the four-byte preset ID from the preset window, with no device address in front of it.
4. Subscribe with `0x89` or `0x8E` when you need the live value. The first reply is the current value. Later replies follow changes. After a `0x90` bump, send subscribe again. The guide says a bump does not return a set message for each step.
5. On serial, wait for `0x06`. `0x15` means the checksum failed. If you enabled acknowledgement and a second passes with neither byte, the device retransmits. Ethernet has no acknowledgement bytes. Generate a new string from Audio Architect when the object ID changes, because that ID comes from the processing object in the venue file.

Source: [Soundweb London third-party control](https://help.harmanpro.com/soundweb-london-third-party-control).

## FAQ

### Which integer is unity on a gain?
The guide says the raw value at unity is 0, and it calls that 73.73%. The same row prints `-280,617` as 0% and −80 dB, and `100,000` as 100% and +10 dB. Mute uses 0 and 1.

### Does a preset recall need the node address?
`0x8C` recalls a Soundweb London preset by the preset ID, four bytes, and the guide says no addressing is used. A parameter set still carries node, virtual device, object ID, and parameter ID.

### Will this talk to a Crown amplifier on the same HiQnet network?
The guide says Crown, JBL, and AKG devices do not respond to London Direct Inject. Soundweb London devices do, on TCP 1023, without a separate enable step.
