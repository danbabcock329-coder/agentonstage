---
title: "Fire ColorSource AV cues and playbacks over OSC"
slug: fire-colorsource-av-cues-and-playbacks-over-osc
category: "Lighting"
tools: ["ETC ColorSource AV", "OSC", "UDP"]
difficulty: Intermediate
source_url: https://www.etcconnect.com/webdocs/Controls/ColorSourceAV_onlinehelp/en/Content/CommandsOSC.html
labels: ["Commercial product"]
summary: "ColorSource AV receives OSC on UDP. The default receive port is 8005. /cs/playback/go runs the next cue, and /cs/ping opens output."
---

## What it does

ETC's ColorSource AV online help lists the OSC methods the console accepts. The network tab is where the address is set. OSC Remote Control IP is the device the console sends OSC to and receives OSC from. OSC Send Port and OSC Receive Port are the two port fields. ETC's restricted-ports note says the console defaults to port 8006 for sending and port 8005 for receiving, and that those defaults should be kept when possible. The same note says ports 11011, 11012, 8001, 8002, 8012, and 8013 are used internally and should be avoided. A separate ETC article says ColorSource AV OSC is UDP only, and that OSC over TCP is not supported. USB receive is mentioned there for #lighthack.

The help page says arguments may be appended to the path when the sending software does not carry OSC arguments. `/cs/ping` tests the connection, and the console replies with `/cs/out/ping`. Output is not sent until some OSC packet has been received. ETC's output article says that after every power-on, and after waking from hibernate, the console will not emit OSC until it has been sent a string. `/cs/ping` is the example they give.

`/cs/playback/go` runs the next cue. `/cs/playback/goback` runs the previous cue. `/cs/playback/pause` pauses an active cue fade. `/cs/playback/goto` and `/cs/playback/gotocue` take a cue number and go to that cue. `/cs/key/blackout` toggles blackout. `/cs/key/videooff` toggles the HDMI video output. `/cs/chan/select` takes a channel number and selects that channel alone. `/cs/chan/at` sets the selected channel to a level from 0 to 100. `/cs/color/rgb` takes red, green, and blue from 0 to 100.

Playbacks are numbered in the path. `{x}` is 1 to 20 or 1 to 40 depending on the console model. `/cs/playback/{x}/level` takes a level from 0.0 to 1.0. `/cs/playback/{x}/fire` takes 1 for pressed and 0 for released. The help page lists four accepted ways to press and hold the bump button for playback 12: `/cs/playback/12/fire/1`, `/cs/playback/12/fire` with argument 1, `/cs/playback/12` with arguments `"fire"` and 1, and `/cs/playback` with arguments 12, `"fire"`, and 1. `/cs/playbacks/selectPage` takes a page from 1 to 10.

Once output is open, the console sends `/cs/out/active/cue/text` with the cue label and the cue number when the current cue changes, `/cs/out/playback/go` with the cue label when Go is pressed, and `/cs/out/playback/{x}/level` when a playback level changes.

## How to set it up

1. On the console, open Settings and the Network tab. Leave Auto on if a DHCP server is present. The help page says Auto sets the IP and subnet and is the recommended setting. Set OSC Remote Control IP to the address of the controller.
2. Leave OSC Receive Port at 8005 and OSC Send Port at 8006 unless you have a reason to move them. Stay off 11011, 11012, 8001, 8002, 8012, and 8013. Send UDP, which is the only OSC transport the protocol article allows.
3. Send `/cs/ping` and wait for `/cs/out/ping`. Do this after every power-on and after hibernate. Until that first packet arrives, the output article says the console sends nothing.
4. Run the cue list with `/cs/playback/go`. Go to a numbered cue with `/cs/playback/gotocue` and the cue number, either in the path or as an argument. Select channel 1 and put it at full with `/cs/chan/select` and `/cs/chan/at` using channel 1 and level 100.
5. Bump playback 12 by sending `/cs/playback/12/fire/1`, then `/cs/playback/12/fire/0` to release. Set a level with `/cs/playback/12/level` and a float from 0.0 to 1.0. Read `/cs/out/active/cue/text` for the cue label and cue number after Go.

Source: [ColorSource AV OSC commands](https://www.etcconnect.com/webdocs/Controls/ColorSourceAV_onlinehelp/en/Content/CommandsOSC.html), [Settings > Network](https://www.etcconnect.com/webdocs/Controls/ColorSourceAV_onlinehelp/en/Content/TabSettingsNetwork.html), [restricted OSC ports](https://support.etcconnect.com/ETC/Consoles/ColorSource/Software_and_Programming/ColorSource_Console_Restricted_OSC_Ports), and [OSC is UDP](https://support.etcconnect.com/ETC/Consoles/ColorSource/Software_and_Programming/What_Protocol_does_ColorSource_AV_Console_use_for_OSC).

## FAQ

### Why is there no OSC coming back?
The command page says output is not sent until an OSC packet has been received, and the example is `/cs/ping`. The output article says this is required again after power-on and after waking from hibernate. The reply to ping is `/cs/out/ping`.

### Can the same message go over TCP?
ETC's protocol article says ColorSource AV OSC uses UDP, and that OSC via TCP is not supported. The receive default in the restricted-ports note is UDP port 8005, and the send default is 8006.

### How many playbacks can the path address?
The playback section says `{x}` is 1 to 20 or 1 to 40 depending on the console model. Pages are 1 to 10 on `/cs/playbacks/selectPage`. Playback 12's bump examples are the four syntaxes printed for `/fire`.
