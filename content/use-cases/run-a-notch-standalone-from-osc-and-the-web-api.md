---
title: "Run a Notch standalone from OSC and the Web API"
slug: run-a-notch-standalone-from-osc-and-the-web-api
category: "LED/Video"
tools: ["Notch", "OSC"]
difficulty: Intermediate
source_url: https://manual.notch.one/2026.2/en/docs/reference/devices-protocols/osc/
labels: ["Commercial product"]
summary: "An exported Notch standalone can take play, pause, reset, time, and layer over OSC, and can set exposed properties from an HTTP GET once the Web GUI is on."
---

## What it does

Notch's OSC page describes two different uses. Inside a project, OSC Modifier and OSC Text read numeric and string messages into the node graph, and OSC Output sends floats back out. Those incoming values are processed only while the play head is playing, and outgoing values are sent only while it is playing. Separately, an exported standalone can take transport commands. `/notch/transport/play` and `/notch/transport/pause` take a bool. `/notch/transport/reset` returns to time zero. `/notch/transport/time` takes a float in seconds. `/notch/transport/layer` takes an int, starting at 0. The manual says those transport commands do nothing in Builder.

The Web GUI page is the other door. A standalone with Web GUI enabled listens on port 8910. `GET /control` returns a JSON manifest of exposed properties (`protocolVersion`, then a `controls` list with `uniqueId`, `type`, `value`, and for floats a min and max). Setting one is also a GET: `/control?uid=` the escaped unique id, and `&value=` the new value. The HTTP API page shows text, float, and colour examples. Colour is a comma-separated RGBA list. The exposed-parameters page says exposing a property is an RFX-license feature, and that opening the project on another license removes those exposed properties.

Two limits matter on a show. Only one block or process can bind a given OSC port. And once a media server has the Web GUI link up, the Web GUI page says exposed parameters ignore media server updates, so the two writers do not fight. Builder will not change layers from the Web GUI. Layer changes over OSC also fail when Keyboard Transport is enabled on a standalone. The Web GUI page says any machine that can reach that port can control the project, and that IP security is left to you.

## How to set it up

1. For transport, open Project, then Settings, then the OSC pane. Enable OSC, enable Transport, and set the UDP port. Confirm packets in View, then Connection Monitor. Export a standalone. Transport commands are ignored in Builder.
2. Send `/notch/transport/play`, `/notch/transport/pause`, `/notch/transport/reset`, `/notch/transport/time`, or `/notch/transport/layer` to that port. Turn Keyboard Transport off if layer selection has to work.
3. For exposed properties, enable Web GUI under Project, then Settings, then the General tab. Compile a standalone and open `http://127.0.0.1:8910`. Another computer uses the machine's IP on that same port.
4. `GET /control` and read each `uniqueId` from the JSON. Set a value with `GET /control?uid=<escaped id>&value=<value>`. URL-escape text and colour commas.
5. Keep port 8910 off the public network. The manual does not describe an authentication step.

Source: [Notch OSC](https://manual.notch.one/2026.2/en/docs/reference/devices-protocols/osc/), the [Web / HTTP API](https://manual.notch.one/2026.1/en/docs/reference/devices-protocols/web-http-api/), and the [Web GUI](https://manual.notch.one/2026.2/en/docs/web-gui/).

## FAQ

### Can an assistant do this inside Notch Builder?
Transport OSC and Web GUI layer changes are standalone behaviours. The OSC page says transport commands have no effect in Builder. The Web GUI page says Builder does not support layer changes through the Web GUI. Node-graph OSC modifiers are the path that runs in the project itself, and they only update while the play head is playing.

### Does the Web API replace a media server?
It is a second writer. The Web GUI page says that after the Web GUI link is up, exposed parameters ignore updates from the media server. Use one controller for those properties.
