---
title: "Bridge DMX, Art-Net and sACN with Open Lighting Architecture"
slug: bridge-dmx-art-net-and-sacn-with-open-lighting-architecture
category: "Lighting"
tools: ["OLA", "DMX", "Art-Net", "sACN"]
difficulty: Intermediate
source_url: https://github.com/OpenLightingProject/ola
summary: "The open-source \"travel adaptor\" for lighting protocols that many agent and scripting tools use underneath."
---

## What it does

The open-source "travel adaptor" for lighting protocols that many agent and scripting tools use underneath.

## How to set it up

1. Install OLA from your package manager or build from source.
2. Start the daemon with `olad` and open the web UI (port 9090 by default) to patch devices to universes.
3. Point your scripts or agent tools (such as dmx-mcp) at OLA instead of talking to interfaces directly.

Source project: [OpenLightingProject/ola](https://github.com/OpenLightingProject/ola)

## FAQ

### Which protocols?
DMX512 over USB interfaces, Art-Net, sACN/E1.31 and others.

### Is it maintained?
It's a long-running open project. Check the repo for recent releases.
