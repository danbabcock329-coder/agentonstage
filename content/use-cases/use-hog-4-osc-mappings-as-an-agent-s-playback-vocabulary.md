---
title: "Use Hog 4's OSC map as an agent's playback vocabulary"
slug: use-hog-4-osc-mappings-as-an-agent-s-playback-vocabulary
category: "Lighting"
tools: ["Hog 4", "OSC"]
difficulty: Intermediate
source_url: https://www.etcconnect.com/webdocs/Controls/HOG/HTML/en/sect-osc_mappings.htm
summary: "Hog 4 OS publishes OSC paths for cuelists, scenes, macros, front-panel keys, and the grand master, which is the command list an agent should send instead of guessing."
---

## What it does

High End's Hog 4 OS manual treats OSC as a way to drive basic console functions from another OSC device. Section 22.1 says input works on every console in the Hog 4 family, including Hog 4 PC. Section 22.4 is the map. The manual prints each path with spaces around the slashes. On the wire those spaces are not part of the address: go a cuelist is `/hog/playback/go/0` with the cuelist number as the data. A goto uses that same path, and the manual's data column is `cuelist #.cue #`. Halt, resume, and release use `/hog/playback/halt/0`, `/hog/playback/resume/0`, and `/hog/playback/release/0`. Scenes use the same verbs with `/1` instead of `/0`. Macros use `/2`. The manual's release-macro row spells the last word "Marco".

Front-panel keys are a second family. Go, pause, back, flash, and choose are `/hog/hardware/go/<master>`, `/hog/hardware/pause/<master>`, `/hog/hardware/goback/<master>`, `/hog/hardware/flash/<master>`, and `/hog/hardware/choose/<master>`. Data `1` is key press on and `0` is key press off. Number keys are `/hog/hardware/zero` through `/hog/hardware/nine` with the same 1 and 0. The grand master is `/hog/hardware/fader/0`. The manual writes that fader's data as `0 < 255`. Main encoder wheels are `/hog/hardware/encoderwheel/<n>`, with data written as `-20 < 20`.

The console also sends status when OSC Out is on. Paths include `/hog/status/commandline`, `/hog/status/led/` plus a button name, encoder labels and values, and three chat lines.

## How to set it up

1. Put the OSC sender on the same LAN as the console's HogNet port. Section 22.2: Setup, then Network, right-click the console number, Settings, then the Open Sound Control pane. Enable OSC In and set the input port to the sender's output port. The pane shows the console IP next to that port.
2. For replies, section 22.3 says enable OSC Out, set the output port to the listener's input port, and enter the destination IP and the protocol the pane asks for.
3. ETC's Touch OSC setup article recommends input port 7001 and output port 7002, and says the two ports have to differ. Those numbers are that article's recommendation. The manual itself tells you to match the other device.
4. Send playback from the section 22.4 table. Give an agent that table, not a paraphrase of every hardware key, and keep the first sends off a show.
5. Read `/hog/status/commandline` if you enabled OSC Out, so a go can be checked against the desk.

Source: [Hog 4 OS OSC mappings](https://www.etcconnect.com/webdocs/Controls/HOG/HTML/en/sect-osc_mappings.htm), [configuring OSC input](https://www.etcconnect.com/webdocs/Controls/HOG/HTML/en/sect-connecting_osc.htm), [configuring OSC output](https://www.etcconnect.com/webdocs/Controls/HOG/HTML/en/sect-connecting_osc_output.htm), and [How To Setup Touch OSC and Hog 4](https://support.etcconnect.com/HES/Consoles/Hog_4/Networking/How_To_Setup_Touch_OSC_and_Hog_4).

## FAQ

### Can OSC patch a fixture or set one DMX address?
The introduction calls OSC a way to control basic functions. The Touch OSC article says the templates have no DMX test, and that OSC cannot control specific addresses in a particular universe. Playback, keys, faders, and encoders are the map in section 22.4.

### Do encoders work on Hog 4 PC with no hardware?
The Touch OSC article says encoders will not work on a Hog 4 PC system with nothing attached. It lists a NanoHog, Hoglet, Wing, or an unlocked ETCnomad key as the hardware that changes that.
