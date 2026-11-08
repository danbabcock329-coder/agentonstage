---
title: "Fire D::Light cues over OSC"
slug: fire-dlight-cues-over-osc
category: "Lighting"
tools: ["D::Light", "OSC"]
difficulty: Intermediate
source_url: https://www.getdlight.com/wiki/index.php/OSC
labels: ["Commercial product"]
summary: "D::Light SETUP listens for OSC on port 7000 by default. /seq/go with 1 is Go. /seq/X2LoadAndFireCue loads a cue and fires it. /grandmaster takes 0 to 255."
---

## What it does

D::Light's own wiki documents an OSC remote for the console. The SETUP page says OSC is turned on and off from Display, then SETUP, with the ON/OFF LED. The same page says D::Light receives OSC on port 7000 by default, and that the listen port can be set anywhere from 1001 to 64000. Outgoing OSC uses the address and port in the lower part of that window. The OSC page says the port assigned for sending defaults to 51200, and its terminal examples send to port 51200. Those two pages do not name one number for every socket. Read the Port field on the SETUP window of the machine you are driving.

The command table is headed as the version 4 syntax. A Go is `/seq/go` with the value 1. Go back is `/seq/goback` with 1. Pause is `/seq/pause` with 1. `/seq/X2LoadAndFireCue` takes a cue number, loads it, and fires it. `/seq/X2LoadAndFireID` does the same for a step ID. The OSC page's terminal examples, using liblo's `oscsend` and a float argument, are:

```
oscsend localhost 51200 /seq/go f 1.0
```

```
oscsend localhost 51200 /seq/X2LoadAndFireID f 12
```

That second command fires step ID 12. The port in both lines is 51200, which is the number the OSC page uses in the terminal section, not the 7000 default printed on the SETUP page.

Levels are 8-bit unless the address says otherwise. `/grandmaster` takes 0 to 255, and the console sends `/grandmaster` back in that same range. `/sub/9/level` takes 0 to 255 for submaster 9. `/sub/9/phase` is the float form, 0.0 to 1.0. `/circ/22/level` takes 0 to 255 for circuit 22. `/force/blackout` takes 0 or 1 and sets blackout. `/pad/blackout` with 1 toggles it. `/force/freeze` takes 0 or 1 and sets the DMX freeze. `/macroExec` takes a macro number. `/macroKill` with `all` kills every running macro.

Device color is separate from the circuit level. The 16-bit address `/device/1/COLOUR/RED` takes 0 to 65535. The 8-bit address is `/device8bits/1/COLOUR/RED`, 0 to 255. The float address is `/devicephase/1/COLOUR/RED`, 0.0 to 1.0. Replies come back on `/device/1/COLOUR/RED` in the 16-bit range. Focus for one device is `/device/1/xy` with two floats from 0.0 to 1.0, pan then tilt.

The SETUP page has a switch labeled "use Virtual SubMaster for /circ or /device messages". When that path is on, circuit levels arriving over OSC go through a virtual submaster instead of the sequencer output. The page says those circuits then stay put when a Go runs. Absolute versus relative is the other processing switch: absolute writes the received level, and relative adds it, including a negative value.

## How to set it up

1. In D::Light, open Display, then SETUP, and turn the OSC LED on. Read the listen port. The SETUP page says the default is 7000 and that the allowed range is 1001 to 64000. If the field shows another number, send there.
2. Fire the next cue with `/seq/go` and the value 1. The OSC page's `oscsend` line is `oscsend localhost 51200 /seq/go f 1.0`, which only matches a console whose listen port is 51200. Change the port to the SETUP field before you trust that line.
3. Fire a known cue with `/seq/X2LoadAndFireCue` and the cue number. Fire a step ID with `/seq/X2LoadAndFireID`. The documented float form for ID 12 is `/seq/X2LoadAndFireID` with `12`.
4. Set the grand master with `/grandmaster` and an integer from 0 to 255. Set submaster 9 with `/sub/9/level` in that same range. If a later Go should not steal circuits you are writing over OSC, enable the virtual submaster option on the SETUP page.

Source: [D::Light OSC wiki](https://www.getdlight.com/wiki/index.php/OSC) and [D::Light SETUP wiki](https://www.getdlight.com/wiki/index.php/SETUP).

## FAQ

### Is the port 7000 or 51200?
The SETUP page says D::Light receives on port 7000 by default, and that you can change it between 1001 and 64000. The OSC page says the default send port is 51200, and both of its `oscsend` examples target 51200. Use the listen port shown in SETUP on that computer.

### What is the difference between Go and Load & Goto Cue?
`/seq/go` with value 1 is the Go command in the version 4 table. `/seq/X2LoadAndFireCue` takes a cue number. `/seq/X2LoadAndFireID` takes a step ID. The terminal example fires ID 12 with a float argument of `12`.

### Will a Go wipe out a circuit I just set over OSC?
It can. The SETUP page says `/circ` and `/device` messages can be written straight to the output, or through a virtual submaster. The virtual submaster is the option that keeps those circuits from changing when a Go runs.
