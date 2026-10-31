---
title: "Talk a Green-GO channel over OSC"
slug: talk-a-green-go-channel-over-osc
category: "Audio"
tools: ["Green-GO", "OSC"]
difficulty: Intermediate
source_url: https://manual.greengoconnect.com/en/scripting/osc/
labels: ["Commercial product"]
summary: "Green-GO's OSC API listens on a UDP port from 6500 to 65535. /Channel/1/Talk with integer 2 latches talk on channel 1. A bare address reads the value back, but /Reboot reboots anyway."
---

## What it does

Green-GO's OSC page documents a UDP API aimed at one device's unicast address. The page says the API is still under development, that some device properties may not function correctly or may behave unexpectedly, and that OSC bundles and wildcards are not supported. It also says the WBPX and the BCN do not support OSC. Other devices only show the OSC option in the info menu when the firmware has it.

You set the port in that OSC option. The page says the same port is used to send to the device and to receive responses. `/OSC_API/OSC_PORT` is an integer. Values from 6500 to 65535 are the listening port. Any other value sets the port to 0, which the page labels OFF. `/OSC_API/REMOTE_PORT` uses the same numeric window. Any other value sets it to 0, which the page labels AUTO, and AUTO uses the same number as the receiving port.

An OSC message is an address, a type tag, and arguments. The page says address capitalization is not case-sensitive. Sending an address with no argument makes the device reply with the current value. The exception on that same page is `/Reboot`: the device reboots even when no argument is given. A valid argument writes the value. Which addresses exist depends on the device type.

Channels are numbered 1 to 32 in `/Channel/N/...`. `/Channel/N/Talk` takes an integer: 0 is Mute, 1 is Reserved, 2 is Talk Latch, and 3 is Talk momentary. The page says a channel set to Talk momentary will not automatically clear. `/Channel/N/Listen` is 0 for Muted and 1 for On. `/Channel/N/Call` is 0 for Off, 1 for Call, and 2 for Alert Call. `/Channel/N/Cue_Out` is 0 Idle, 1 Off, 2 Attention, 3 Wait, 4 Go, 5 Hold, 6 Ready, and 7 Not Ready. `/Channel_Status/N/Talk_Status` is read only: 0 Off, 1 Active Auto, 2 Active.

`/Settings/Identify` is 0 for Off and 1 for Identify. That is a safer first write than opening a talk path. `/device/Type` returns the device type name.

## How to set it up

1. On a device other than a WBPX or a BCN, open the info menu, enter the OSC option, and set a port from 6500 to 65535. Note the device's unicast IP.
2. Send OSC over UDP to that IP and port. Query `/device/Type` with no argument and read the reply before you write anything. The page's own example client is Python 3.13.3 with python-osc 1.9.3.
3. Query `/Channel/1/Talk` with no argument and keep the returned integer. Query `/Settings/Identify`, set it to 1, confirm the device identifies, then set it back to 0.
4. Latch talk on channel 1 with `/Channel/1/Talk` and the integer 2. Mute it with the integer 0. Leave the integer 3 unused unless you have a later message that clears it. The page says Talk momentary does not clear itself.
5. Read `/Channel_Status/1/Talk_Status` after the latch. Leave `/Reboot` unused. The page says that address reboots the device even when the message has no argument. Treat a missing reply as a reason to stop, because the page says some properties may not behave as listed.

Source: [Green-GO OSC](https://manual.greengoconnect.com/en/scripting/osc/)

## FAQ

### Are the addresses case-sensitive?
The OSC page says address capitalization is not case-sensitive. The tables still spell the addresses as `/Channel/N/Talk`, `/Settings/Identify`, and `/OSC_API/OSC_PORT`.

### Which port can you pick?
`/OSC_API/OSC_PORT` accepts 6500 through 65535. Any other value sets the port to 0, which the page labels OFF. The WBPX and the BCN are listed as devices that do not support OSC.

### What does a message with no argument do?
The page says the device replies with the current value. `/Reboot` is the exception written on that page: it reboots even when no argument is sent. Bundles and wildcards are not supported in the current version.
