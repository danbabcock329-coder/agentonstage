---
title: "Drive TouchDesigner from a phone with OSCAR"
slug: drive-touchdesigner-from-a-phone-with-oscar
category: "TouchDesigner"
tools: ["OSCAR", "TouchDesigner", "OSC"]
difficulty: Beginner
source_url: https://www.createwithoscar.com/getting-started/touchdesigner
summary: "OSCAR's TouchDesigner rack sends /td/speed and the other rack addresses to an OSC In CHOP on port 10000. Return meters go to OSCAR on port 8880."
---

## What it does

OSCAR's TouchDesigner guide is a phone or tablet surface for a running network. OSCAR serves the controls to the phone's browser. TouchDesigner reads them with an OSC In CHOP. Nothing is installed on the phone. The guide says the local path is free. OSCAR Pro is the option it names for a public link when the visitor is on mobile data and not on the show Wi-Fi.

The template is TouchDesigner Parameter Rack: four faders, an XY pad, a colour picker, a caption, three scene keys, and two meters that listen back. Every control already sends OSC to port 10000, which the guide calls TouchDesigner's default for an OSC In CHOP. The sketches on that page are written for TouchDesigner 2022.35320 or newer.

The rack addresses are fixed. `/td/speed` is one float from 0 to 2. `/td/scale`, `/td/hue`, and `/td/feedback` are one float each, from 0 to 1. `/td/position` is two floats, x then y, from −1 to 1, so the OSC In CHOP shows two channels. `/td/colour` is three floats, r, g, and b, from 0 to 1. `/td/caption` is the text as typed. `/td/scene/1`, `/td/scene/2`, and `/td/scene/3` send 1 when pressed, and the last one pressed stays.

The two meters are the return path. An OSC Out CHOP sends `/td/audio/level` and `/td/sensor/distance`, each from 0 to 1, to OSCAR's IP on port 8880. The guide says both meters follow on every phone that has the rack open.

The same page ships two sketches that use every control. Type Tunnel puts the caption through a tunnel of its own trails, a tiled wall, or an orbit, and scenes 1 to 3 switch those. Kaleido Feedback is a kaleidoscope of noise centred on the pad, with scenes 1 to 3 selecting 3, 6, or 12 mirrors. Each `.tox` brings its own OSC In CHOP on port 10000.

## How to set it up

1. On the show computer, add an OSC In CHOP and leave Network Port at 10000. The guide says the rack's channels arrive named after the addresses, such as `td/speed`, `td/scale`, `td/position/x`, `td/position/y`, and `td/colour/r`. Wire them with a Select CHOP or an Export.
2. Add an OSC Out CHOP if the meters should move. Set Network Address to OSCAR's IP and Port to 8880. Name the channels `td/audio/level` and `td/sensor/distance`, and send values from 0 to 1.
3. In OSCAR, choose File, Open project or template, TouchDesigner Parameter Rack. If TouchDesigner is on another computer, select every control and set its Ip to that computer. On the same computer the guide says `localhost` is already set.
4. Press Publish, then Publish in the window that opens, and scan the QR code with a phone on the same network. Move a fader and watch the OSC In CHOP channel.
5. If the channel stays still, click ACTIVITY in OSCAR's top bar. The log shows each message, the address, and the port. The guide says to check the OSC In CHOP port and that a firewall on the TouchDesigner computer allows UDP 10000.

Source: [OSCAR for TouchDesigner](https://www.createwithoscar.com/getting-started/touchdesigner).

## FAQ

### Is this Open Stage Control?
[Drive Open Stage Control surfaces over OSC remote commands](/use-cases/drive-open-stage-control-surfaces-over-osc-remote-commands) is a different surface. This page is OSCAR's Parameter Rack, with the addresses and ports in the table above, aimed at an OSC In CHOP.

### Is this an agent that builds the network?
[Drive TouchDesigner from coding agents with TDMCP](/use-cases/drive-touchdesigner-from-coding-agents-with-tdmcp) edits operators inside TouchDesigner. OSCAR does not. It publishes a control layout and sends OSC. The guide's optional `touchdesigner-parameter-rack.py` only builds the demo CHOPs: paste it into a Text DAT, set `OSCAR_IP`, and run it.

### Which TouchDesigner build is the guide written for?
The sketches are written for 2022.35320 or newer. The rack itself is an OSC sender to port 10000 plus, if you want the meters, an OSC Out CHOP to port 8880.
