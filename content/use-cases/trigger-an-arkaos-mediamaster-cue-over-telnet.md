---
title: "Trigger an ArKaos MediaMaster cue over Telnet"
slug: trigger-an-arkaos-mediamaster-cue-over-telnet
category: "LED/Video"
tools: ["ArKaos MediaMaster", "Telnet", "TCP"]
difficulty: Intermediate
source_url: https://cdn.arkaos.com/arkaos/downloads/ArKaos_MediaMaster_6_User_Guide.pdf
labels: ["Commercial product"]
summary: "MediaMaster 6 player mode takes Telnet after Enable Telnet is on. Companion 2.0.1 sends Cue:1 and Controller:Play with CR LF. Its default port is 45678."
---

## What it does

The ArKaos MediaMaster 6 user guide's Remote Player chapter says external control in player mode includes MIDI, Art-Net, Telnet/TCP, and UDP. The player is turned on by setting MediaMaster to Player mode in the preference menu. It can be the same machine as the MediaHub or another machine on the network. Telnet and Art-Net are enabled in File, Preferences, Remote Command Service. The guide says to mark Enable Telnet or Enable Art-Net and to select the IP address to listen on. It does not print a port number, and it does not print the command strings. On the TELNET tab you select a control and click the command that is shown, which copies it to the clipboard.

Bitfocus Companion's `arkaos-mediamaster` module, version 2.0.1, is a TCP client for that player. Its configuration text says the module works with MediaMaster 6 in player mode, and that the remote player has to be activated. The target port field defaults to 45678. That default is the module's, not a number printed in the user guide. Read the port MediaMaster is actually listening on before you use it. Each send appends a carriage return and a line feed to the command string.

The module's preset list is the command set it ships. Transport strings include `Controller:Play`, `Controller:Pause`, `Controller:Stop`, `Controller:Next`, `Controller:Previous`, `Controller:First`, `Controller:Last`, `Controller:Final15`, and `Controller:Final30`. `Cue:1` is the first cue preset. The list continues as `Cue:` plus a number. `Fullscreen:On` and `Fullscreen:Off` are separate strings. The module stores the last TCP payload it receives in the variable `tcp_response`. The user guide does not describe that reply.

## How to set it up

1. In MediaMaster 6, set the preference mode to Player. In File, Preferences, Remote Command Service, mark Enable Telnet and select the IP address the guide tells you to listen on. Copy one command from the TELNET tab so you can see the string that installation shows.
2. Compare that string with the Companion preset you plan to send. The module's play preset is the text `Controller:Play`. Its first cue preset is `Cue:1`. The module then adds CR LF.
3. Point the module at the MediaMaster machine. Leave the port at 45678 only if that is the port the preferences are using. The user guide does not print 45678.
4. Send `Controller:Stop` or a cue you can see on the player before `Controller:Play`. The module records whatever comes back in `tcp_response`.
5. `Controller:Final15` and `Controller:Final30` are in the same preset list as play and stop. The user guide's cue-action list is a different set of end-of-cue behaviors: Follow, Pause, Stop, Jump to Cue, and Hold. Those names are not the Telnet strings.

Source: [MediaMaster 6 user guide](https://cdn.arkaos.com/arkaos/downloads/ArKaos_MediaMaster_6_User_Guide.pdf) and [bitfocus/companion-module-arkaos-mediamaster](https://github.com/bitfocus/companion-module-arkaos-mediamaster) version 2.0.1.

## FAQ

### Is 45678 the port in the MediaMaster manual?
No. The user guide says to select the listen address and to copy the command from the TELNET tab. It does not print a port. 45678 is the default of the Companion module's port field.

### Does the user guide print Cue:1?
It tells you to click the command shown on the TELNET tab and paste it into a Telnet client. The string `Cue:1`, and `Controller:Play`, are the preset commands in Companion module 2.0.1. Check the copied string against those presets on the machine you have.

### Will the player answer?
The module keeps a Last TCP Response variable. The user guide does not describe a reply, so an empty `tcp_response` is not something that chapter explains. Watch the player.
