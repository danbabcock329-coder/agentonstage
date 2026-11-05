---
title: "Run Smode scenes and timelines from Companion"
slug: run-smode-scenes-and-timelines-from-companion
category: "LED/Video"
tools: ["Smode", "Bitfocus Companion", "HTTP"]
difficulty: Beginner
source_url: https://doc.smode.io/userGuide/tutorialsAndHow-Tos/connectionAndInteractivity/companion/
labels: ["Commercial product"]
summary: "Smode's HTTP server feeds the official Companion module. Compose turns that server off while ON AIR. The module page says Live talks on port 8080."
---

## What it does

Smode's Companion guide says a Stream Deck can control Smode Server through the official Smode module in Companion. It names Companion for Windows 3.2.2 or a later build as the version that includes the module. You add a Smode Live connection, then match the IP address, the port, and the HTTP mode to the Smode configuration.

The HTTP server itself is a preference. Smode's HTTP Server page says it has to be activated for Companion, a Stream Deck, or any other plugin built on the API. The fields are Run Server, Listening Address, Timeout, HTTP mode (HTTP, HTTPS, or HTTP with a certificate), the certificate files, and an IP filter list that can be a blacklist or a whitelist. The page says that on Smode Compose the HTTP server is disabled while ON AIR. The Companion guide repeats that limit: on Compose, being ON AIR disables communication between Companion and Smode.

Smode's own "develop your own API plugin" page says Smode Tech does not release its API documentation yet, and gives contact@smode.io for that. The published control surface is the Companion module, not a public list of HTTP paths.

Once the module is connected, the guide says presets follow the state of the servers, the devices, and the current project. The actions it lists are toggle ON AIR, toggle OUTPUT, and toggle Power Save Mode. It says power save slows the engine, so a button that does not answer instantly is expected. Read-only variables are edition, version, engine status, FPS, and VRAM. Get Contents and Get Devices refresh those lists when auto-polling is off. Each device can be muted. Each scene can have its activation toggled and its loading toggled. Each main timeline, in a scene or in the show, can be sent play, pause, reset, next, previous, and loop. Each marker can be sent go to marker. Each parameter bank can apply a parameter state.

The Bitfocus page for the module, community version 1.1.2, says it connects to a Smode Live device, asks for Smode Live version 10 at least, and says the device communicates over port 8080. Its action list adds explicit on and off for scene activation and scene loading, plus timeline finalize, alongside the toggles. The authors named there include Smode Tech.

## How to set it up

1. On the Smode machine, open Preferences and turn the HTTP server on. Note the listening address and whether the mode is HTTP or HTTPS. On Compose, expect that server to switch off when the machine goes ON AIR.
2. In Companion 3.2.2 or later, add the Smode Live connection. Match the IP, the port, and the HTTP mode to that preference. The Bitfocus module page says Live uses port 8080. If the Smode listening address is different, use the address Smode is actually showing.
3. Confirm the module can read edition, version, and status before you send a transport command. Get Contents and Get Devices are the manual refreshes when auto-polling is off.
4. Trigger a timeline only after the preset list shows the project. The guide's transport names are play, pause, reset, next, previous, and loop. Go to marker is per marker. Apply a parameter state is per parameter bank.
5. Do not expect the HTTP API paths to be on the public doc site. The plugin-development page says that documentation is not released. Use the module's actions, and treat power save as slow to answer.

Source: [Smode's Companion guide](https://doc.smode.io/userGuide/tutorialsAndHow-Tos/connectionAndInteractivity/companion/), the [HTTP Server preference](https://doc.smode.io/reference/preferences/engine/other/http-server/), and the [Bitfocus Smode Live module](https://bitfocus.io/connections/smodetech-smodelive) page (v1.1.2).

## FAQ

### Does ON AIR leave the HTTP server running?
On Compose, no. The HTTP Server page says the server is disabled if ON AIR, and the Companion guide says ON AIR disables communication with Companion. The Bitfocus page is written for Smode Live, version 10 at least.

### Where is the list of HTTP URLs?
Smode's plugin-development page says the API documentation is not released and points to contact@smode.io. The commands you can cite from the public docs are the Companion actions: scene activation and loading, timeline transport, markers, parameter states, device mute, ON AIR, output, and power save.

### What is port 8080?
The Bitfocus module page says the device communicates over port 8080. Smode's own HTTP Server page says the listening address is a preference. The Companion guide tells you to make the connection match that preference, including the HTTP mode.
