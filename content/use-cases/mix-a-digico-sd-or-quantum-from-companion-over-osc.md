---
title: "Mix a DiGiCo SD or Quantum from Companion over OSC"
slug: mix-a-digico-sd-or-quantum-from-companion-over-osc
category: "Audio"
tools: ["DiGiCo", "OSC", "Bitfocus Companion"]
difficulty: Advanced
source_url: https://github.com/bitfocus/companion-module-digico-osc
summary: "Companion's digico module 2.0.1 listens on UDP 7001 and transmits to UDP 7000. /Input_Channels/1/fader is a level from -150 to 10 dB."
---

## What it does

Bitfocus Companion module `digico`, version 2.0.1 in the repository's package file and in the v2.0.1 tag published on 3 November 2026, controls a DiGiCo SD or Quantum console over OSC. The module config defaults are mixer IP `192.168.1.100`, transmit port 7000, and receive port 7001. In `mixers.ts` the module binds its UDP socket on the receive port and sends each OSC packet to the mixer IP on the transmit port. The log line when the socket opens is `Listening on UDP` plus that receive port.

The v2.0.1 help file tells you to add the Companion computer on the console as a DiGiCo Pad, not as Other OSC, when you want the DiGiCo remote-control command set. On the console it says System, External Control, Enable External Control, YES, then Add Device, DiGiCo Pad. The IP address in that device is the computer running the module, not the console. The help's example sets the console Send port to 7000 and the console Receive port to 7001, and then tells you to set the module's listen port to 7000 and its send port to 7001. Those example numbers are the reverse of the module's own defaults, which listen on 7001 and send to 7000. Match the two sides to each other. The port the module binds is the console's Send port. The port the module transmits to is the console's Receive port.

The same help says to load a Commands Allowed file if the console reports that none are enabled. Clear All first if an older set may be loaded. For an SD8, SD9, SD11, SD12, or SD12-96 it says to load `iPadv2sd8-9-11-12`. For a Quantum it says to select the iPad v2 Quantum file shown in the Load dialog, and it names `ipad_q3` for any Quantum console. The recommended list in that help is Bundles off initially and Suppress OSC Retransmit on. The External Control window shows the console's Local IP Address, which is the address you put in the module's Mixer IP.

The command table shipped in that tag, `digico_osc.csv`, has 651 OSC paths. The path counts are 154 group outputs, 148 aux outputs, 145 matrix outputs, 131 input channels, 34 graphic EQs, 19 console paths, 5 control groups, 5 matrix inputs, 4 multis, 3 meter paths, 2 layout paths, and 1 talkback input. A `*` in a path is replaced with the index selected in Companion. The fallback index in the action code is 1, so the default input-fader path is `/Input_Channels/1/fader`.

That fader row is a float, read/write, from -150 to 10, unit dB, scale 1. The number control shows the -150 minimum as negative infinity when the unit is dB and the minimum is -150. `/Input_Channels/*/mute` and `/Input_Channels/*/solo` are BFloat values from 0 to 1, read/write. A BFloat is sent as a float. `/Input_Channels/*/Channel_Input/phantom` is the same 0 to 1 float, and the CSV description is "48 V phantom power state". The CSV does not say which number is on. The same mute and fader shapes exist for group outputs, aux outputs, matrix outputs, control groups, and multis. `/Console/Name` is a read-only string, described as the console name. `/Console/Session/Filename` is a read-only string, described as the current session file. `/Console/Input_Channels` is a read-only int from 0 to 384, described as the number of input channels configured on the console. Sixteen descriptions in the CSV contain the word MAYBE. Those rows are not settled by the table.

Writable numeric rows that are also readable get Relative and Cross-fade options in the action code. Cross-fade duration defaults to 1000 ms and is limited to 1 through 60000 ms. For a dB row, the ramp is interpolated in amplitude rather than in a straight dB line.

## How to set it up

1. Install Companion module version 2.0.1, or build that tag. The package name is `digico`. Set Mixer IP to the console Local IP from External Control. Leave Transmit Port at 7000 and Receive Port at 7001 only if the console is set to the matching direction: console Send 7001, console Receive 7000. If you follow the help file's sample of console Send 7000 and Receive 7001, change the module so it listens on 7000 and transmits to 7001.
2. On the console, enable External Control, add a DiGiCo Pad, and enter the Companion computer's IP. Load `iPadv2sd8-9-11-12` on an SD8, SD9, SD11, SD12, or SD12-96. On a Quantum, load the iPad v2 Quantum file the console shows. The help names `ipad_q3`. Confirm the window no longer says that no commands are enabled.
3. Read before you write. `/Console/Name` and `/Console/Session/Filename` identify the desk and the session. `/Console/Input_Channels` is the configured input count. Then read `/Input_Channels/1/fader` before you set it.
4. Set `/Input_Channels/1/fader` with a float from -150 to 10 dB. The module displays -150 as negative infinity. Set mute, solo, or phantom with a float 0 or 1, and confirm on the console which value is the on state before a show. Skip any CSV row whose description says MAYBE.

Source: [bitfocus/companion-module-digico-osc](https://github.com/bitfocus/companion-module-digico-osc), tag v2.0.1, including `companion/HELP.md`, `src/config.ts`, `src/mixers.ts`, and `digico_osc.csv`.

## FAQ

### Why do the help file and the module defaults disagree on 7000 and 7001?
The help's example sets console Send to 7000 and console Receive to 7001, and tells the module to listen on 7000 and send to 7001. `config.ts` in the same tag defaults transmit port to 7000 and receive port to 7001, and `mixers.ts` binds the receive port and sends to the transmit port. Use one pair. The bound port has to be the console Send port.

### Which SD and Quantum desks does the help name?
The help names SD8, SD9, SD11, SD12, and SD12-96, with the command file `iPadv2sd8-9-11-12`. For Quantum it says to load the iPad v2 Quantum file from the console's Load dialog, and it names `ipad_q3`.

### Does mute 1 mean muted?
The CSV says `/Input_Channels/*/mute` is a BFloat from 0 to 1 and describes it as the mute state. It does not say which end is muted. Read the path, change it once in rehearsal, and read it back.
