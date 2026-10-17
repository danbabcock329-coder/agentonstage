---
title: "Connect DmxControlPro3 to an external assistant with the Agent API"
slug: connect-dmxcontrolpro3-to-an-external-assistant-with-the-agent-api
category: "Lighting"
tools: ["DmxControlPro3", "DMX", "OpenAPI"]
difficulty: Intermediate
source_url: https://lightning-dmxcontrol.com/dmxcontrolpro-3
labels: ["Commercial product"]
summary: "DmxControlPro3 3.2 adds an optional local HTTP/OpenAPI Agent API so a compatible external assistant can read the running Mac show and request supported channel, patchbay, preset, cue, window and project actions."
---

## What it does

DmxControlPro3 3.2 adds an optional local HTTP/OpenAPI Agent API so a compatible external assistant can read the running Mac show and request supported channel, patchbay, preset, cue, window and project actions.

## How to set it up

1. Install version 3.2 from the Mac App Store. The download is free and the full version is a one-time in-app purchase. Cues, DMX, Art-Net, MIDI, OSC and media keep working if you never turn the API on.
2. Leave the API on the show Mac. It is a local HTTP/OpenAPI interface. The app does not include a cloud AI service, and it does not send prompts or show data to JV Multimedia.
3. For a second computer, enable LAN mode and create an enabled API key. Clients off the loopback address must present that key and sit on the same active local subnet. Keep the port off the internet and off guest Wi-Fi.
4. On a live show, have the assistant read the current state, explain one bounded action and wait for the operator before sending a change. JV Multimedia describes that wait as an operating habit, not a confirmation dialog on every request.

Source: [DmxControlPro3 3.2](https://lightning-dmxcontrol.com/dmxcontrolpro-3) and the [3.2 release notes](https://lightning-dmxcontrol.com/dmxcontrolpro-releasenotes)

## FAQ

### What can the assistant change?
The 3.2 notes list supported channel, patchbay, preset, cue, window and project actions. The product page also describes proposing patchbay mappings, channel names and colours, turning a running order into cues and presets, and proposing backlight colours from image or video references, then applying the changes you approve.

### Which version is this?
The release notes date version 3.2 to 14 July 2026.
