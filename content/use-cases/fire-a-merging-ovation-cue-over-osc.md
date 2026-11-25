---
title: "Fire a Merging Ovation cue over OSC"
slug: fire-a-merging-ovation-cue-over-osc
category: "Show Control"
tools: ["Merging Ovation", "OSC", "UDP"]
difficulty: Intermediate
source_url: https://help.neumann.com/hc/en-us/articles/38359229008018-Ovation-OSC-configuration
labels: ["Commercial product"]
summary: "Ovation, from version 9, takes OSC over UDP only. /Server/Cue/Fire 2 4 fires cue 4 in list 2. A gain of -5 is ignored unless the value ends with a dot."
---

## What it does

Merging's Ovation OSC configuration page, on the Neumann help site and updated 21 October 2026, is the setup for sending and receiving OSC in Ovation. The page says OSC has been supported since Ovation 9, and that the transport is UDP. The type note says to use a UDP streamer or a UDP receiver, because OSC does not support TCP connections. For Ravenna or AES67, the page recommends a separate network interface for OSC.

The full address list is not on the web page. The page says the supported commands are in `C:\Program Files\Merging Technologies\Ovation\Docs\OSC Dictionary.TXT` on the Ovation machine. It then prints four examples. `/Server/Cue/Fire 2 4` fires cue 4 in cue list 2. `/Server/Show/Stop` stops the show. Commands are not case-sensitive. `/Mixer/Strip/Phase 2 -1` and `/mixer/strip/phase 2 -1` both toggle phase invert on mixer strip 2. A float has to contain a dot. `/Mixer/Strip/Gain -1 -5.` sets the fader of the selected strip to -5.0. The page says `/Mixer/Strip/Gain -1 -5` without the dot will not work.

The worked receiver is IP2, a UDP receiver on the Ovation computer at 192.168.1.100, port 8001. The third-party controller sends to that address and port. The worked streamer is IP1, a UDP streamer aimed at 192.168.1.105 port 8000, which is the path Ovation uses when it sends OSC out. The page says a receiver address of 0.0.0.0 accepts OSC on every adapter, and that 127.0.0.1 is the address when Ovation and the other program are on the same computer. It says to avoid ports under 1024, and that 8000 is the usual place to start.

To receive show control, the controller-unit section says to enable the UDP receiver, set the port type to OSC, and turn on the message groups you need. `/Server` messages are show state, cues, and cue lists. `/Mixer` messages are the mixer. `/CueMapping` messages are per-cue. A cue that should fire, pause, or stop on an incoming OSC string has to use a command that begins with `/CueMapping/` or `/cuemapping/`, and Dispatch `/CueMapping` messages has to be enabled on that receiving port. The page says you can send the string from the controller and pick it from the latest-message list next to the Fire, Pause, or Stop field, and that the chosen string still has to start with `/CueMapping/`.

## How to set it up

1. In Application Settings, General, IP Connections, set one IP slot to UDP Receiver on the Ovation machine. The page's example is 192.168.1.100 port 8001. Apply the change. OSC on TCP is the combination the page says not to use.
2. Under Controller Units, enable that IP slot, set it to OSC, and enable `/Server` messages. Enable `/Mixer` only if the client will move strips. Enable `/CueMapping` only if a cue is waiting for a custom string.
3. Point the client at that IP and port. Fire cue 4 in cue list 2 with `/Server/Cue/Fire 2 4`. Stop the show with `/Server/Show/Stop`. The page says the addresses are not case-sensitive.
4. For a fader, include the dot. `/Mixer/Strip/Gain -1 -5.` is the example that sets the selected strip to -5.0. The same page says the line without the dot does not parse. `/Mixer/Strip/Phase 2 -1` toggles phase on strip 2.
5. Keep custom cue triggers under `/CueMapping/`. A string that does not start that way is not the cue-mapping path the page describes. The rest of the dictionary is the local `OSC Dictionary.TXT`, not a second public list.

Source: [Ovation OSC configuration](https://help.neumann.com/hc/en-us/articles/38359229008018-Ovation-OSC-configuration).

## FAQ

### Is port 8001 required?
The page's example receiver is 192.168.1.100 port 8001, and the example streamer sends to port 8000. It also says the port number must be unique and that ports under 1024 are best avoided. Use the port saved on that IP slot.

### Why does the gain example end with a dot?
The page says float values have to be entered with a dot to parse. `/Mixer/Strip/Gain -1 -5.` is the line that sets the selected strip to -5.0. `/Mixer/Strip/Gain -1 -5` is the line it says will not work.

### Where is the rest of the address list?
The page points at `C:\Program Files\Merging Technologies\Ovation\Docs\OSC Dictionary.TXT` on the installed machine. The public page itself prints the fire, stop, phase, and gain examples above, and it says the commands are not case-sensitive.
