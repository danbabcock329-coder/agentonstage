---
title: "Drive a SKAARHOJ panel over Raw Panel"
slug: drive-a-skaarhoj-panel-over-raw-panel
category: "Show Control"
tools: ["SKAARHOJ", "TCP"]
difficulty: Intermediate
source_url: https://www.skaarhoj.com/raw-panel
labels: ["Commercial product"]
summary: "SKAARHOJ Raw Panel is a TCP server. The library's default port is 9923. Send list for the hardware map. HWC# lines report presses, and HWCc# sets color."
---

## What it does

SKAARHOJ Raw Panel is the IP protocol the panels speak. The developer page says the panel is the TCP server and your client connects to it. A press, an encoder turn, a fader move, or a joystick move arrives as a trigger that names the hardware component and the value. The client answers with feedback: LED color by index or by RGB, button state, titles, text lines, and UTF-8. Panels advertise with mDNS/ZeroConf. The library README says they register the service type `_skaarhoj-rwp._tcp`.

The same README says the default TCP port is 9923. ASCII is newline-delimited and is the form every controller supports. JSON is the v2 text encoding the developer page describes. Protobuf, length-prefixed, is what Blue Pill and Blue Pill Inside support. `ConnectToPanel` in the library dials the panel as a TCP client.

After you connect, the developer page says a command such as `list` makes the panel describe its hardware: ids, types, positions, display resolution, and color capability, as JSON plus SVG. You do not hard-code one panel's layout.

Triggers use the `HWC#` line. The README's state-feedback section says the current input is reported as `HWCstate#id=Down`, `Up`, `Abs:yy`, or `Speed:yy`, and that those are the same values as the `HWC#` trigger. A vector control uses `HWC#id=Abs:x,y` or `Speed:dx,dy`. Text entered on the panel is `HWC#id=Text:` plus the rest of the line.

Feedback uses the same family of lines. The README says mode is the `HWC#` value, color is the `HWCc#` value, and the extended value is `HWCx#`. `HWCColor#id=0` means no color is set. A client that wants the current state sends the line `state`. The README says there is no end-of-reply marker, that each value is its own line, and that the panels which implement it are the Link IO firmwares it names: SmartTally, UniSketch Panel, ETH-GPI, TallyBox, and ETH-SDI. A panel announces `StateFeedback` in its `_support` list when it can answer.

The Raw Panel Emulator on the developer page runs the same TCP server without the hardware, with a browser view of the surface.

## How to set it up

1. Give the panel an address the show machine can reach, or start the Raw Panel Emulator. Connect a TCP client to port 9923 unless the panel is configured to another port. The library documents 9923 as the default.
2. Send a line `list`. Use the ids in the topology the panel returns. The developer page says this is how one client supports more than one panel model.
3. Read trigger lines. A button reports `HWC#` plus the id, then `Down` or `Up`. An encoder or fader reports `Abs:` or `Speed:` and a value. Treat `Abs:0` as a real position. The state section says an unset field means "not reported," so zero is not a missing value.
4. Paint a key with `HWC#id=` and the mode value, and `HWCc#id=` and the color value. Send `state` when you need the panel's current input and output, and only on hardware that lists `StateFeedback`. Do not wait for a closing line. The README says there is not one.
5. Discover panels with `_skaarhoj-rwp._tcp`. The README says the serial and the model are in the TXT records, not in the hostname.

Source: [SKAARHOJ Raw Panel](https://www.skaarhoj.com/raw-panel) and the [rawpanel-lib README](https://github.com/SKAARHOJ/rawpanel-lib/blob/master/Readme.md).

## FAQ

### Is every panel on port 9923?
The library calls 9923 the default. Connect to the port the panel is listening on if that was changed. The emulator is a TCP server in the same way as the hardware.

### Which text encoding should an agent send first?
ASCII, one command per line, is the encoding the README says every controller supports. JSON is v2. Protobuf is the Blue Pill form. `ConnectToPanel` probes with a binary ping so a panel that can do both does not stay on ASCII.

### Why did `state` come back as several lines and then go quiet?
The README says each value is its own line and that there is no end-of-reply marker. It also limits that command to panels that advertise `StateFeedback`, and names the Link IO firmwares that implement it.
