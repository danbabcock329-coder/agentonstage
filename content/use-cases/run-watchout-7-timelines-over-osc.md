---
title: "Run WATCHOUT 7 timelines over OSC"
slug: run-watchout-7-timelines-over-osc
category: "LED/Video"
tools: ["Dataton WATCHOUT", "OSC"]
difficulty: Intermediate
source_url: https://docs.dataton.com/guide/watchout/external-control/osc-protocol.html
summary: "WATCHOUT 7 listens for OSC on UDP 8000 and TCP 8001, plays or stops a timeline by id, and maps any other address onto a show variable."
---

## What it does

Dataton's WATCHOUT 7 user guide describes OSC as a way to send variable values and timeline playback commands from any OSC device. OSC is turned on per node: Nodes window, Node Info, Protocols, OSC toggle.

The node listens on two ports at once, on every interface. UDP 8000 is ordinary OSC. TCP 8001 is OSC with length-prefixed framing, which the guide points at for a lossy network. The guide says the node accepts messages from any device that can reach it.

Playback addresses use the `/wo/` prefix. `/wo/play/{timeline_id}` and `/wo/run/{timeline_id}` start a timeline. `/wo/pause/{timeline_id}` pauses it. `/wo/stop/{timeline_id}` stops it. The timeline id is a number such as 1 or 2. A third path segment is a cue id, and playback jumps to that cue's start: `/wo/play/{timeline_id}/{cue_id}`. A time jump is an argument on the play message instead of a cue segment. A float is seconds, so 10.5 is ten and a half seconds. An int is milliseconds and must be zero or greater, so 10500 is the same instant. The guide's example is `/wo/play/1` with a float argument of 5.0. OSC bundles are not supported. Each message is sent on its own.

Anything that does not match those playback patterns is a variable input. The external key is `osc.addr({address}/{argument_index})`, and the index starts at 0. One float on `/stage/brightness` becomes `osc.addr(/stage/brightness/0)`. Extra arguments on the same message get the next indexes. Floats are used as sent. Ints are converted to floating point. The guide says string and blob arguments produce an error. Variable inputs use a 50 ms interpolation window, and WATCHOUT stamps each message when the node receives it, before it is forwarded to the Director.

## How to set it up

1. On the WATCHOUT node, open Node Info, then Protocols, and enable OSC. Confirm the machine is reachable on UDP 8000 or TCP 8001 from the controller.
2. Send one message at a time. `/wo/play/1` starts timeline 1. `/wo/play/1/4` jumps to cue 4 on that timeline, using the cue id from the show. `/wo/pause/1` and `/wo/stop/1` hold or stop it.
3. To land at a time, send `/wo/play/1` with a float in seconds or a non-negative int in milliseconds. Leave the cue id out of the path when you do that.
4. For a variable, define the WATCHOUT input whose external key matches `osc.addr(` plus the address, a slash, and the argument index. Send a float or an int. A string argument is an error.
5. Keep both ports on the show network. The guide does not describe an authentication step, and it says any reachable device can send.

Source: [WATCHOUT 7 OSC protocol](https://docs.dataton.com/guide/watchout/external-control/osc-protocol.html)

## FAQ

### Can one OSC bundle carry go and a brightness change?
The guide says bundles are not supported. Send the playback message and the variable message as two packets.

### Which argument types land in a variable?
Float and int. The guide says other types, including string and blob, produce an error. Ints are converted to floating point before they are used as the variable value.
