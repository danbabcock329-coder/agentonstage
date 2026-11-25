---
title: "Set a Dugan Model E channel over ASCII"
slug: set-a-dugan-model-e-channel-over-ascii
category: "Audio"
tools: ["Dan Dugan Model E", "Telnet", "ASCII"]
difficulty: Intermediate
source_url: https://www.dandugan.com/Assets/manuals/Model-E-User-Guide.pdf
labels: ["Commercial product"]
summary: "The Model E ASCII guide sets channel 2 to auto with CM 2,1 and echoes that line. Telnet is the test path. Internet control is named on port 9776."
---

## What it does

Dan Dugan's Model E User Guide, chapter 6, is the ASCII remote control for the Model E automatic mixing controller. The introduction calls it an eight-channel processor that patches into console insert points. The chapter says every control on the remote control panel can be reached with a command string, and that ASCII can run at the same time as the web control panel.

The test steps are to open Telnet to the Model E's address and type the command. Chapter 6 does not print a port number. Chapter 5, in the web-panel section, says the Model E can be controlled over the Internet on port 9776, and that only someone with advanced network skills should try that. The guide does not say that 9776 is the Telnet port in chapter 6.

Two framings are printed. Plain ASCII is the command plus a carriage return, ASCII 13. The guide says that form is for a quick test from a terminal. The extended form starts with byte 0xFE, then the command, then a checksum byte. The guide defines 0xFE as hexadecimal FE and as 254 decimal, and the same sentence prints the binary `0111 1111`. The checksum is the lower 7 bits of the sum of every byte from 0xFE through the carriage return, inclusive. When the unit sees 0xFE it switches to the extended form, and the reply uses that form too. The guide recommends the extended form for reliability, and it says the two forms may be mixed.

Spaces and tabs are removed before parsing, and case does not matter. The guide says `NE3,1`, `Ne 3, 1`, and `n E3, 1` are the same command. A comma is required when a channel is specified. Every command gets a reply. The introduction says the reply echoes the command. The worked success is `NE3,1` coming back as `NE3,1`. The worked failure is `NE3,` coming back as `NE Syntax error`, which the guide calls a missing parameter.

Channel mode is `CM`. `0` is manual, `1` is auto, and `2` is mute. The query example sends `CM 2` and shows the reply `CM 2, 0`, meaning channel 2 is manual. The set example sends `CM 2, 1` and shows the reply `CM 2, 1`, meaning channel 2 is in auto. Bypass is `BP`. `0` is no bypass and `1` is bypass. `BP 2` is answered `BP 2, 0` when channel 2 is not bypassed. `BP 2, 1` sets that bypass, and the reply is `BP 2, 1`.

Auto-mix weight is `CW`, in dB, maximum 20 and minimum -100. The set example is `CW 2, -4.55`, and the reply echoes `CW 2, -4.55`. A channel name is `CN`, 15 characters maximum. System mute is `SM`. `SM 1` mutes every channel and `SM 0` unmutes them. `SP 1` sends the system preset so every channel goes to its preset mode. The guide says `SP 1` should always be followed by `SP 0`. The reply printed for `SP 1` is `SP OK`. `FP` resets the unit to factory presets, the same result as booting with Bypass 1 held down. The guide says that reset does not change the network settings or the analog/digital I/O mode, and the reply is `FP OK`.

## How to set it up

1. Put the computer and the Model E on one subnet. The chapter 5 example uses mask 255.255.255.0. Open Telnet to the unit's address. Chapter 6 does not print a port. The port 9776 sentence is the internet-control line in chapter 5, not a Telnet example.
2. Query before you write. Send `CM 2` and a carriage return. The printed manual reply is `CM 2, 0`. `0` is manual, `1` is auto, and `2` is mute.
3. Set channel 2 to auto with `CM 2,1` and a carriage return. Accept it when the reply echoes `CM 2, 1`. A reply that contains `Syntax error` is the missing-parameter shape in the `NE3,` example. Spaces in the command are removed before parsing.
4. For a show client, use the 0xFE frame. The checksum is the low 7 bits of the sum from 0xFE through the carriage return. The guide's 0xFE sentence also prints the binary `0111 1111` next to hexadecimal FE.
5. Do not send `FP` from a cue. The guide calls it the factory-preset reset. If you send `SP 1`, follow it with `SP 0`. The printed reply for `SP 1` is `SP OK`, which is not an echo of the command.

Source: [Dan Dugan Model E User Guide, chapter 6](https://www.dandugan.com/Assets/manuals/Model-E-User-Guide.pdf).

## FAQ

### Does every reply echo the command?
The introduction says the reply echoes the command, and the `NE3,1` example comes back as `NE3,1`. `SP 1` is printed as coming back `SP OK`. `FP` is printed as coming back `FP OK`.

### Is 0xFE the binary the sentence prints?
The guide says 0xFE is hexadecimal FE and 254 decimal, and the same sentence prints the binary `0111 1111`. The checksum rule is separate: the low 7 bits of the sum of the bytes from 0xFE through the carriage return.

### Does a channel name survive a factory preset?
`FP` is described as the same reset as the web panel's System Reset, and the web-panel section says a System Reset clears channel naming. The `FP` section says the reset does not change the network settings or the analog/digital I/O mode. An `IP` write, in the same command list, does not take effect until the Model E reboots.
