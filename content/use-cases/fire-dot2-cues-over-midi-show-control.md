---
title: "Fire dot2 cues over MIDI Show Control"
slug: fire-dot2-cues-over-midi-show-control
category: "Lighting"
tools: ["MA Lighting dot2", "MSC", "UDP"]
difficulty: Advanced
source_url: https://help.malighting.com/dot2/en/help/key_ht_usemidiandmsc.html
labels: ["Commercial product"]
summary: "dot2 takes MSC over UDP when Mode is Ethernet. The documented Go to cue 35 starts 47 4D 41 00. Only the session master accepts it."
---

## What it does

dot2 receives MIDI Show Control from show control or sound software. The MIDI Show Control window opens from Setup, column Show, MIDI Show Control. Mode defaults to Disabled. Ethernet sends and receives on the Ethernet Port shown in that window. MIDI uses the connector on the back. The window does not print a default port number. Sender and receiver have to match, including Device ID, Group ID, and Command Format. Tools, then MIDI Monitor, shows the bytes in and out.

In a session, only the master sends and receives MSC. The how-to page marks that console as the one with the blue heart beside the command line. A standalone console handles MSC itself. The window says to send or receive, not both, because both at once can loop.

The how-to page limits what MSC can hit: executors on the first page, or the main executor. The window's Exec field defaults to Main Only. Exec.Page and Exec Page both address an executor on page 1. Exec.Page separates executor and page with a dot, hex 2E. Exec Page uses a space, hex 20.

Command Format defaults to All, hex 7F. General Light is 01. Moving Light is 02. dot2 only transmits and responds to those three. Device ID 7F is the broadcast id. 00 through 6F are individual devices. 70 through 7E are groups.

The MSC commands dot2 supports are Go (01), Stop (02), Resume (03), Timed Go (04), Set (06), Fire (07), and Go Off (0B). Go is a Goto and needs a cue number. The cue is ASCII hex, including the decimals and the dot. Cue 4.000 is `34 2E 30 30 30`. Fire takes one octet for the macro, and only macros 1 through 255. Macro 1 is 01. Macro 24 is 18.

Ethernet MSC is a UDP payload with a 12-byte header in front of that SysEx. The first eight bytes are `47 4D 41 00 4D 53 43 00`, which the page reads as GMA MSC. The next four are the length of the whole message, header included, little-endian. The documented Go to cue 35 is 13 bytes of MSC, plus 12 of header, so the length is 25, hex 18:

`47 4D 41 00 4D 53 43 00 18 00 00 00 F0 7F 7F 02 7F 01 33 35 2E 30 30 30 F7`

That Go uses device 7F, format 7F, and command 01. The cue text is 35.000. Fire macro 1 is 8 bytes of MSC. Plus the 12-byte header, the message is 20 bytes, and the length field is hex 13:

`47 4D 41 00 4D 53 43 00 13 00 00 00 F0 7F 7F 02 7F 07 01 F7`

Timed Go puts five time bytes before the cue: hour, minute, second, frame, fraction. The page says the console does not accept a time in the frame or fraction bytes. It does transmit sub-second times in the frame byte, with the second split into 24 frames.

## How to set it up

1. On the console that should listen, open Setup, Show, MIDI Show Control. Set Mode to Ethernet. Set the Ethernet Port, Device ID, Group ID, and Command Format to the same values as the sender. Leave Exec at Main Only until you mean to address page 1.
2. If the desk is in a session, send to the master, the console with the blue heart. Do not enable MSC in and out on the same path. The window says that can loop.
3. For a Go to cue 35 with All devices and All format, send the 25-byte UDP payload above. Watch Tools, MIDI Monitor, for the same bytes.
4. Fire macro 1 with the 20-byte payload above. Stay inside macros 1 to 255. The page says macro 255 is FF.
5. Keep frame and fraction at zero on a Timed Go. The how-to page says the console will not accept a time written in those two bytes.

Source: [Use MIDI and MIDI Show Control](https://help.malighting.com/dot2/en/help/key_ht_usemidiandmsc.html) and the [MIDI Show Control window](https://help.malighting.com/dot2/en/help/key_window_midishowcontrol.html).

## FAQ

### Which port does Ethernet MSC use?
The window shows an Ethernet Port field and says both ends have to match. It does not print a default. Read the number on the desk before you send.

### Can MSC hit an executor on page 2?
The how-to page says MSC controls executors on the first page or the main executor. The window's other Exec choices are both described as page 1.

### Who hears MSC in a session?
Only the session master. The how-to page identifies it by the blue heart next to the command line. A standalone console handles its own MSC.
