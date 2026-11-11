---
title: "Activate ETC Paradigm presets over PSAP"
slug: activate-etc-paradigm-presets-over-psap
category: "Lighting"
tools: ["ETC Paradigm", "PSAP", "UDP"]
difficulty: Intermediate
source_url: https://www.etcconnect.com/WorkArea/DownloadAsset.aspx?id=10737514967
labels: ["Commercial product"]
summary: "Paradigm PSAP 5.1 activates a preset with pst act and a carriage return. UDP input defaults to port 0. ETC's recommended port range is 4703-4727."
---

## What it does

ETC's Paradigm Serial Access Protocol configuration guide, document 7180M1250-5.1.0 Rev A, released 2023-08, is the command set for a Paradigm Architectural Control Processor. The guide says it reflects PSAP software version 5.1 and later. The processor accepts the same strings on its RS232 port and on Ethernet. LightDesigner holds the port settings. RS232 defaults to 9600 baud, parity none, stop bits 1, and the guide says 8 data bits are required. UDP Serial Config defaults the Input UDP Port to 0 and the Input Handler to None. ETC recommends an input port in the range 4703–4727. Responses go back to the sending device's output UDP port. The guide also recommends that an Ethernet serial packet stay at or under 512 bytes.

A command is not complete until the End of Message character arrives. The default is one carriage return, shown as CR, which is 13 decimal and 0D hexadecimal. LightDesigner can switch that property to CR+LF or to LF. Data the processor sends back uses the same terminator. `?` or `help`, followed by that terminator, returns the list of commands.

Object names are case sensitive and have to match LightDesigner. The guide says to avoid commas and colons in those names, because both characters are part of the parser. A level is either 0–255 or 0–100% with the percent sign. Optional priority, when the command has one, is 1–200. The guide says supplying a priority on a preset or sequence makes that action persist beneath higher-priority actions. White space separates parameters. White space inside an object name is allowed.

`pst act Preset 1, Primary Space 1,5` is the guide's example for activating Preset 1 as LTP in Primary Space 1 with a five-second fade. `pst dact` deactivates from LTP. `pst acth` and `pst dacth` are the HTP pair. `pst tog` inverts LTP state. Fade time is `x.y` seconds, in tenths. The preset section says that to use a fade time you must also specify a space name. `pst rec` records a preset. That command does not belong in a cue client.

`chan int:128 Zone 1` sets Zone 1 to 50%. `chan int:75% Dimmer 2, Primary Space 1` sets Dimmer 2 in that space to 75%. `spc off Primary Space 1` activates the Off preset in that space. `macro on Macro 1` executes the On steps of that macro. `ovr enab Override 1` enables an override.

`pst get` is the status read. The returned string is `pst act`, `pst dact`, or `pst alt` for the LTP side, and the guide says the space name is always included in the reply even when the query omitted it. Levels in status replies are always 0–255.

ETC's separate note on Eos UDP strings says an Eos string ends with carriage return plus line feed by default, and that a Paradigm processor typically expects the CR it was given in LightDesigner. That note's CR-only example appends `\x0d` to `pst act P1 - Day`.

## How to set it up

1. In LightDesigner, select the processor and set UDP Serial Config. Choose an Input UDP Port in ETC's recommended range, 4703–4727, and set the Input Handler to PSAP 5.1. Leave End of Message Char at CR unless the project already uses LF or CR+LF.
2. Send one UDP datagram to the processor's address on that port. End the string with the configured terminator. The default is a single carriage return, 0D hex. Keep the datagram at or under 512 bytes.
3. Read the preset before you activate it. `pst get` plus the preset name, then the terminator, comes back as `pst act`, `pst dact`, or `pst alt`, with the space name filled in.
4. Activate with the guide's shape, `pst act Preset 1, Primary Space 1,5`, using the real preset name, space name, and fade. The fade is in seconds and needs the space name. From Eos, the string article says to append `\x0d` when Paradigm is set for CR only, because Eos otherwise ends the string with CR+LF.
5. Leave `pst rec` out of the client. It records a preset. Leave `spc off` out unless that space should go to its Off preset. A priority argument, 1–200, makes the activation persist beneath higher-priority actions.

Source: [Paradigm Serial Access Protocol (PSAP) 5.1, 7180M1250-5.1.0 Rev A (2023-08)](https://www.etcconnect.com/WorkArea/DownloadAsset.aspx?id=10737514967) and [Eos UDP strings to Paradigm](https://support.etcconnect.com/ETC/Consoles/Eos_Family/Software_and_Programming/Configuring_An_Eos_Family_Console_To_Output_UDP_Strings_To_Paradigm).

## FAQ

### Which UDP port does the processor open?
The guide says the Input UDP Port property defaults to 0. The recommended range for the port the sender uses is 4703–4727. Replies go to the sender's output UDP port, not back onto that input port.

### Why does a preset command do nothing until a second character arrives?
The guide says a command is complete only after the End of Message character. The default is one carriage return. If LightDesigner is set to CR and the sender adds CR+LF, the extra line feed is not the terminator the property lists. The Eos article's CR-only suffix is `\x0d`.

### What does a level of 128 mean?
The channel example `chan int:128 Zone 1` sets Zone 1 to 50%. The same section accepts `75%` when the percent sign is present. Status replies always come back as 0–255, and they always include the space name.
