---
title: "Set Resolume layer opacity over OSC"
slug: set-resolume-layer-opacity-over-osc
category: "LED/Video"
tools: ["Resolume", "OSC"]
difficulty: Intermediate
source_url: https://resolume.com/support/en/osc
labels: ["Commercial product"]
summary: "Resolume listens on port 7000 by default. /composition/layers/1/video/opacity 0.25 sets layer 1 to 25 percent. Send ? to an address to read the current value."
---

## What it does

Resolume's OSC support page says the addresses are already fixed, so a message works without a MIDI-style shortcut assignment. OSC input is turned on in Preferences, on the OSC tab. The incoming port defaults to 7000, and the page says you can change it. The IP of the Resolume computer is shown at the top of that same tab. A sender without ZeroConf, which the page also calls Bonjour, has to be given that IP and port by hand. The OSC preferences include a fold-out of the last 200 messages Resolume received or sent.

The page's opacity example is one float on a fixed address:

`/composition/layers/1/video/opacity 0.25`

That sets layer 1 video opacity to 25 percent. The playhead example puts clip 8 in layer 2 at the start of the clip with `/composition/layers/2/clips/8/transport/position 0.0`.

Type tags are shown when you click a control in Shortcuts, Edit OSC. `/composition/layers/1/video/mixer/blendmode` is an int from 0 to 50, and the page says that is 51 blend modes because the count starts at 0. A float from 0.0 to 1.0 sent to an int address is scaled across that int range. The same blend mode also accepts the mode name as a string. The page's example is `/composition/selectedlayer/video/mixer/blendmode` with `Alpha`.

Absolute and relative values use a string argument in front of the number. `/composition/layers/1/clips/1/video/effects/transform/positionx` with `a` and then `320` places that clip at 320 pixels on x. The same page's relative example is `/composition/layers/1/video/effects/transform/positionx` with `+` and then `50`, which moves layer 1 by 50 pixels to the right. `-` and `*` subtract and multiply.

Composition scale is not the same mapping as opacity. `/composition/video/effects/transform/scale` is a float from 0.0 to 1.0 that the page maps onto 0.0 to 1000.0, so 0.1 is 100 percent and 1.0 is 1000 percent. `/composition/video/effects/transform/rotationz` maps 0.0 to 1.0 onto -180 to 180 degrees, and 0.5 is the center.

Sending `?` to an address asks for the current value. The page's example is `/composition/layers/1/video/mixer/blendmode` with `?`, and the reply is the int of that blend mode on the same address.

The address list linked from that page is the set for a composition with one clip in one layer and no effects. It includes `/composition/layers/1/clips/1/connect`, `/composition/layers/1/clips/1/connected`, and `/composition/columns/1/connect`. The support page says the full list changes with the composition, and that Shortcuts, Edit OSC is how you read the address and the type tag for a control this list does not spell out a value for.

OSC output is separate. The preset Output All OSC Messages sends every interface change. A custom preset can limit that to the controls you tick, and a wildcard can cover every layer or every clip. Output to a manual IP, to localhost, or to broadcast also needs the outgoing port, which is the other application's input port. Use Bundles packs the outgoing messages into one bundle.

## How to set it up

1. In Resolume, open Preferences, OSC, and enable OSC input. Read the IP at the top of the tab. Leave the incoming port at 7000 unless the sender will use another port.
2. From the show controller, send `/composition/layers/1/video/opacity` with the float `0.25`. Open the OSC message fold-out if the layer does not move. The page says that fold-out keeps the last 200 messages.
3. Park a clip with `/composition/layers/2/clips/8/transport/position` and the float `0.0`. Set the selected layer's blend mode by sending the string `Alpha` to `/composition/selectedlayer/video/mixer/blendmode`.
4. Read a value back by sending `?` to its address. The documented example is `/composition/layers/1/video/mixer/blendmode` with `?`.
5. For a clip or column connect address, open Shortcuts, Edit OSC, click the control, and use the type tag shown there. The one-clip address list includes `/composition/layers/1/clips/1/connect` and `/composition/columns/1/connect`, and it does not print the argument those addresses take.

Source: [Resolume OSC](https://resolume.com/support/en/osc) and the [one-clip OSC address list](https://resolume.com/download/Manual/OSC/OSC%20list.txt) linked from that page.

## FAQ

### Is this the Companion module?
[Resolume OSC module for Stream Deck via Companion](/use-cases/resolume-osc-module-for-stream-deck-via-companion) is an unofficial module aimed at Arena on port 7000 with feedback on port 7001. The addresses on this page are Resolume's own, and the opacity example does not need that module.

### Can the Arena MCP server send these?
[Build Resolume Arena and Wire shows with official MCP](/use-cases/build-resolume-arena-and-wire-shows-with-the-official-mcp-servers) is the 7.26 server for building a composition. That page says the server cannot edit OSC mappings. Sending `/composition/layers/1/video/opacity` is this OSC input, not that MCP server.

### Is 0.1 always 10 percent?
Not on every address. The opacity example uses `0.25` for 25 percent. The composition scale address maps a float of 0.1 to 100 percent, because its range is 0.0 to 1000.0. Read the type tag in Shortcuts, Edit OSC before reusing a number from a different control.
