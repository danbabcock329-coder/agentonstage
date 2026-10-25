---
title: "Fire ChamSys QuickQ playbacks over OSC"
slug: fire-chamsys-quickq-playbacks-over-osc
category: "Lighting"
tools: ["ChamSys QuickQ", "OSC"]
difficulty: Intermediate
source_url: https://docs.chamsys.co.uk/quickq/13.0/manual/touchosc.html
summary: "From QuickQ 6.0, OSC receives on port 8000 and transmits on 9000. /pb/1/go runs playback 1, and /pb/1 takes a float from 0 to 1 or an integer from 0 to 100 for the fader."
---

## What it does

ChamSys documents OSC on QuickQ consoles from software version 6.0. OSC is off until it is enabled in the Network Settings window, under Settings, Network, Protocols. The console receives on port 8000 and transmits on port 9000. Both ports are fixed.

Playback commands use `/pb/<playback>`. `/pb/1` sets playback 1's fader. The argument is a float from 0.0 to 1.0, or an integer from 0 to 100. `/pb/1/go` goes on that playback. Go, pause, and release take an optional non-zero value. `/pb/1/pause` pauses. `/pb/1/release` releases. `/pb/1/flash` uses 0 for 0% and any non-zero value for 100%. The action column for flash describes that as setting the playback level to 100%.

10Scene buttons use `/10scene/<item>` or `/10scene/<item>/<zone>`. Sending the address with no argument activates the button. An argument of 0 releases it. An argument of 1 activates it.

Feedback is a separate set of addresses with no arguments. `/feedback/pb` transmits playback state. `/feedback/exec` transmits executes. `/feedback/pb+exec` transmits both. `/feedback/off` turns feedback off. The manual does not list the feedback payload. It says those addresses turn feedback on and transmit the state of playbacks and executes.

On a QuickQ 10, the cue-stack playback is playback 1. The two chase playbacks, read from left to right on the console, are playbacks 3 and 2.

## How to set it up

1. On the console, open Settings, Network, Protocols, and enable Open Sound Control in the Network Settings window.
2. Send OSC to the console on port 8000. Listen on port 9000 when you want the console's transmit port.
3. Set a fader with `/pb/1` and a float from 0.0 to 1.0, or an integer from 0 to 100. Go, pause, or release with `/pb/1/go`, `/pb/1/pause`, or `/pb/1/release`.
4. Flash with `/pb/1/flash`. The manual says 0 is 0% and any non-zero value is 100%.
5. Send `/feedback/pb`, `/feedback/exec`, or `/feedback/pb+exec` with no argument when the sender needs state. `/feedback/off` turns that transmission off.

Source: [QuickQ OSC](https://docs.chamsys.co.uk/quickq/13.0/manual/touchosc.html).

## FAQ

### Can the ports be changed?
The manual says the receive port is 8000, the transmit port is 9000, and both are fixed. OSC still has to be enabled under Settings, Network, Protocols.

### Which number is the cue stack on a QuickQ 10?
Playback 1. The manual says the two chase playbacks, from left to right, are playbacks 3 and 2.
