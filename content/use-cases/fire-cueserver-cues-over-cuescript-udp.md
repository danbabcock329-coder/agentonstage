---
title: "Fire CueServer cues over CueScript UDP"
slug: fire-cueserver-cues-over-cuescript-udp
category: "Lighting"
tools: ["Interactive Technologies CueServer", "UDP", "HTTP"]
difficulty: Intermediate
source_url: https://docs.interactive-online.com/cs2/1.0/en/topic/cuescript-via-udp
labels: ["Commercial product"]
summary: "CueServer 2 takes CueScript on UDP port 52737. Unicast Cue 1 Go runs cue 1. Multicast 239.255.204.2 reaches every CueServer on the LAN."
---

## What it does

Interactive Technologies' CueServer 2 manual, revision 26.4.27, documents CueScript as the text language the controller executes. The CueScript via UDP page says a packet is the command string itself. Unicast it to that CueServer's IP on port 52737 and only that unit runs it. Multicast the same packet to 239.255.204.2 on port 52737 and every CueServer on the local network runs it.

The page's examples are `Cue 1 Go`, `Button 1.5 On`, `Macro 7`, and the compact line `P3CL; Q5G; B1ON`. The command-syntax page says spaces, tabs, and newlines are ignored, a semicolon is optional between commands, and case does not matter. It also says `Cue 1 Go` abbreviates to `Q1G`, because Cue can be `Q` and the words can be packed together. The same page's longer example `Time 5 Channel 3 at 50` abbreviates to `T5;C3@50`.

The Cue page says `Cue 1 Go` is two commands: `Cue 1` loads cue 1 as the next cue on the active playback, and `Go` executes it. `Playback 3 Cue 100.5 Go` runs cue 100.5 on playback 3. Cue numbers are whole numbers from 0 to 99999, and may include a decimal from .00 to .99. `Cue 1 Fade 5 Follow 10 Go` loads cue 1, replaces its fade with 5 seconds and its follow with 10 seconds, then executes it. `Playback 3 Cue ?` asks for the current cue on playback 3. The page says a playback with no cue loaded returns a negative number.

Presets are a separate command. The Preset page says `Preset 3 On` activates preset 3 in the current zone and deactivates the other presets there, except presets that share the same channel values. `Preset 3 At 33` recalls it scaled to 33 percent. `Zone "Foyer" Preset 3 On` names the zone first. Preset numbers run from 1 to 999. The abbreviation is `PR`.

The same manual has an HTTP form. CueScript via HTTP says the controller's web server accepts `http://<ip-of-CueServer>/exe.cgi?cmd=<command>`. Its example for cue 1 is `/exe.cgi?cmd=Cue+1+Go`, with the space written as a plus.

## How to set it up

1. Put the control computer and the CueServer on the same show network and read the unit's IP from CueServer Studio. The UDP page uses that address with port 52737. Leave multicast alone until you mean every CueServer on the LAN to execute the same string.
2. Send a UDP datagram whose payload is the CueScript text. `Cue 1 Go` loads cue 1 on the active playback and executes it. `Playback 3 Cue 100.5 Go` names the playback and a decimal cue. `Preset 3 On` recalls preset 3 in the current zone.
3. For a packed string, the command-syntax page treats `Q1G` as `Cue 1 Go`. The UDP page's own packed example is `P3CL; Q5G; B1ON`. Semicolons are optional. Case does not matter.
4. Or use the web server. The HTTP page's example is `http://<ip-of-CueServer>/exe.cgi?cmd=Cue+1+Go`, which runs `Cue 1 Go`. The Cue page says `Playback 3 Cue ?` returns that playback's current cue number, and a negative number when no cue is loaded.

Source: [CueScript via UDP](https://docs.interactive-online.com/cs2/1.0/en/topic/cuescript-via-udp), the [Cue command](https://docs.interactive-online.com/cs2/1.0/en/topic/cue), the [Preset command](https://docs.interactive-online.com/cs2/1.0/en/topic/preset), [command syntax](https://docs.interactive-online.com/cs2/1.0/en/topic/command-syntax), and [CueScript via HTTP](https://docs.interactive-online.com/cs2/1.0/en/topic/cuescript-via-http), in CueServer User's Manual 26.4.27.

## FAQ

### Does one packet hit every CueServer?
Only the multicast form does. The UDP page says a packet sent to the unit's own IP on port 52737 runs on that unit. A packet sent to 239.255.204.2 on the same port is executed by every CueServer on the local network.

### Is Cue 1 Go one command?
The Cue page calls them two commands that are usually sent together. `Cue 1` sets the next cue on the active playback. `Go` executes it. `Q1G` is the abbreviation the command-syntax page gives for that pair.

### What does Playback 3 Cue ? answer?
The Cue page says it returns the current cue number on playback 3. A playback that has no cue loaded returns a negative number.
