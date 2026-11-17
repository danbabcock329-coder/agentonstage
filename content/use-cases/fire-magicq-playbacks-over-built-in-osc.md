---
title: "Fire MagicQ playbacks over built-in OSC"
slug: fire-magicq-playbacks-over-built-in-osc
category: "Lighting"
tools: ["ChamSys MagicQ", "OSC"]
difficulty: Intermediate
source_url: https://docs.chamsys.co.uk/magicq/1.9.9.x/manual/OSC.html
labels: ["Commercial product"]
summary: "The MagicQ 1.9.9.x manual takes OSC on UDP. It suggests receive port 8000. /pb/1/go runs playback 1. A level of 100 sets that fader to full."
---

## What it does

The MagicQ 1.9.9.x manual, last updated 3 November 2026 in the exported PDF of that same manual set, documents OSC send and receive. OSC is supported on MagicQ consoles except the MQ40 and MQ40N, and on PCs when the software is fully unlocked. Built-in addresses cover the first 10 playbacks and the first 10 execute grids. The Autom window is how the manual says to reach the rest of the console.

Setup is in Setup, View Settings, Network. You set the mode and the transmit and receive port numbers. A port of 0 disables that direction. A transmit IP can be set, or left at 0.0.0.0 to broadcast on the lighting network. The manual says a transmit on the control net needs a transmit IP that is on the control net. MagicQ receives OSC on the main lighting network automatically, and on the control net when that firewall is disabled. It says port numbers need to be higher than 1024, and that a good default is 9000 transmit and 8000 receive.

The playback table uses a playback number from 1 to 10. `/pb/` plus that number sets the fader. A float from 0.0 to 1.0 or an integer from 0 to 100 is accepted. `/pb/1/go` is the manual's keyboard test for Go on playback 1. Go, pause, and release take an optional non-zero value. Flash uses 0 for 0% and any non-zero value for 100%. A jump puts the cue id after the playback number. The cue id can include a decimal, and the manual's example of that form is 2.5. An optional non-zero argument goes with the jump. `/dbo` uses 0 to turn blackout on and a non-zero value to turn it off. `/swap` uses 0 for add and a non-zero value for swap. If an argument is left off where the table allows one, either a float or an integer is accepted.

`/rpc` takes a string of ChamSys remote Ethernet commands. `/feedback/off` turns feedback off. `/feedback/pb`, `/feedback/exec`, and `/feedback/pb+exec` turn feedback on and transmit playback and execute state. In the Execute window, select an item, type `//`, and press ENTER to show the OSC address for that button.

The manual says MagicQ only supports OSC over UDP. It can receive OSC bundles. It does not currently transmit bundles.

## How to set it up

1. On a console other than an MQ40 or MQ40N, or on a PC in Unlocked Mode, open Setup, View Settings, Network. Set the OSC mode and set the receive port above 1024. The manual's suggested default is 8000 receive and 9000 transmit. Leave a port at 0 only when that direction should be off.
2. Point the other device at the console's lighting-network address, and set its send and receive ports opposite MagicQ. The troubleshooting section says the two ends must be reversed, and that the MagicQ IP must be the interface you want OSC to use when the PC has more than one network card.
3. From the MagicQ keyboard, type `testosc /pb/1/go` to Go on playback 1. The manual says this keyboard test is supported on consoles and on PC systems unlocked with a MagicQ Wing or Interface. `testosc /pb/1,100` sets playback 1 to 100%. Only one argument is allowed, and it must be preceded by a comma.
4. Send the same `/pb/1/go` and `/pb/1` level from the show-control machine over UDP. Start the address with a forward slash. Stay off addresses the OSC specification disallows.
5. For a playback outside 1 to 10, or for any other console action, add a row in Macro, View Autom, set the type to OSC Message, and put the address in P1. The manual limits a custom command in that window to 15 characters. An expected fader argument is an integer from 0 to 100 or a float from 0.0 to 1.0.

Source: [MagicQ Open Sound Control](https://docs.chamsys.co.uk/magicq/1.9.9.x/manual/OSC.html).

## FAQ

### Is this the MagicQ MCP server?
No. [Run ChamSys MagicQ playbacks from an assistant](/use-cases/run-chamsys-magicq-playbacks-from-an-assistant) sends ChamSys remote Ethernet commands. This page is the console's own OSC address table. `/rpc` is the OSC path the manual gives for a remote Ethernet command string.

### Which playbacks answer the built-in addresses?
The manual says the built-in addresses control the first 10 playbacks and the first 10 execute grids. Playback numbers in that table run from 1 to 10.

### Does it speak TCP?
The notes section says MagicQ only supports OSC over UDP. Receiving bundles is supported. MagicQ does not currently transmit bundles.
