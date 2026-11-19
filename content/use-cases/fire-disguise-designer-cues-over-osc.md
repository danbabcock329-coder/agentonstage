---
title: "Fire disguise Designer cues over OSC"
slug: fire-disguise-designer-cues-over-osc
category: "LED/Video"
tools: ["disguise", "OSC"]
difficulty: Intermediate
source_url: https://help.disguise.one/designer/timeline-tracks-transports/osc/triggering-cues-with-osc
labels: ["Commercial product"]
summary: "disguise Designer receives OSC on port 7401 by default. /d3/showcontrol/cue 7 8 9 jumps to cue 7.8.9. A lone float fires a transport command only at 1.0."
---

## What it does

disguise Designer can take show-control OSC on an OSC device. The device page says the default receive port is 7401, and a blank IP filter accepts messages from any address. A send target defaults to port 7400. Incoming commands do not move the timeline until an EventTransportOSC is pointed at that device and the transport manager is engaged. Engaged flashes green.

The cue page's preferred address is `/d3/showcontrol/cue`. It takes one, two, or three arguments, and every argument has to be the same type, either all integers or all floats. Each argument is one piece of a cue number separated by dots. The QLab example on that page is `/d3/showcontrol/cue 7 8 9`, which calls cue `7.8.9`. Float arguments are rounded to the nearest integer. The page says an error is raised if that rounding would change the number too much. Designer accepts three arguments or fewer from QLab.

`/d3/showcontrol/floatcue` is the one-float form, for a sender that cannot send a list. The page treats that float as two decimal places, so `1.1` is read as cue `1.10`. Only sub-cues from 0 to 99 can be called this way. The table on the page maps `1.10` and `1.1` to cue `1.10`, `1.01` to cue `1.1`, and `1.104` to cue `1.10`.

Transport commands such as `/d3/showcontrol/play`, `/d3/showcontrol/stop`, `/d3/showcontrol/playsection`, and `/d3/showcontrol/loop` fire as soon as the message arrives, including when it has no arguments. The exception is a single float: that form fires only when the float is exactly `1.0`. Brightness and volume are not treated as those state changes. `/d3/showcontrol/volume` and `/d3/showcontrol/brightness` take a float from 0.0 to 1.0, and the controlling page says a missing argument sets the value to 1.0. `/d3/showcontrol/speed` takes a positive float, and a missing argument sets speed to 1.0. The same page says audio does not follow speed changes reliably, and that `enableTransportSpeedControl` in Preview options is off until you enable it.

`/d3/showcontrol/trackname` takes one string and jumps to the start of that track in the current set list. `/d3/showcontrol/trackid` takes one integer, float, or string, converted to a string and matched to the track id. Cue play mode defaults to No change. Cue search is Local, the current track only, or Global, every track in the set list. The addresses above are the defaults. The controlling page says each one can be changed in the show.

## How to set it up

1. In Designer, open Devices and use the default device `osc 1`, or add an OscDevice. Leave the receive port at 7401 unless the sender will use another port. Leave IP Filter blank so any sender on that port is accepted.
2. Right-click Transport. Add an event transport, choose EventTransportOSC, and select that OSC device at the top of the editor.
3. Click Disengaged in the transport window. The setup page says the button changes to Engaged and flashes green. Cues sent before that click do not drive the timeline.
4. Send `/d3/showcontrol/play` with no argument, then `/d3/showcontrol/stop`. A single float on those addresses fires only when it is exactly `1.0`.
5. Jump to cue `7.8.9` with `/d3/showcontrol/cue` and the integers 7, 8, and 9. In QLab the cue page's string is `/d3/showcontrol/cue 7 8 9`. Set `/d3/showcontrol/brightness` to a float from 0.0 to 1.0 when the master brightness should move. That one is not the 1.0 trigger rule.

Source: [Triggering cues with OSC](https://help.disguise.one/designer/timeline-tracks-transports/osc/triggering-cues-with-osc), [Controlling the transport](https://help.disguise.one/designer/timeline-tracks-transports/osc/controlling), [OSC transport setup](https://help.disguise.one/designer/timeline-tracks-transports/osc/setup-osc-transport), and [OSC device](https://help.disguise.one/designer/devices/osc-device).

## FAQ

### Is this the Designer REST API?
[Talk to disguise Designer's REST API from an agent](/use-cases/talk-to-disguise-designer-s-rest-api-from-an-agent) is an MCP service on port 8090. The addresses on this page are the OSC event transport. They do nothing until that transport is engaged.

### Why did 1.1 become cue 1.10?
That is the float-cue rule on the triggering page. One float is read as two decimal places, so `1.1` and `1.10` are the same cue. The multi-argument address `/d3/showcontrol/cue` is the form that can carry cue `1.2.5` as three numbers.

### Does Eos send the same string as QLab?
The cue page's Eos example is `/d3/showcontrol/cue=%3,%4`, and it says the commas in the Eos string are sent as separate arguments. It also says Designer reads cue `1.1` and cue `1.01` as cue `1.1`. The QLab example is three numbers separated by spaces, and Designer accepts three or fewer.
