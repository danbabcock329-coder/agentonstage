---
title: "Recall Allen & Heath AHM presets over TCP"
slug: recall-allen-and-heath-ahm-presets-over-tcp
category: "Audio"
tools: ["Allen & Heath AHM", "MIDI"]
difficulty: Advanced
source_url: https://www.allen-heath.com/content/uploads/2024/10/AHM-TCP-Protocol-V1.5.pdf
labels: ["Commercial product"]
summary: "Allen & Heath AHM TCP protocol V1.5 carries MIDI on port 51325, or TLS on 51327, for mutes, levels, and recall of one of 500 presets."
---

## What it does

Allen & Heath's AHM TCP/IP Protocol document, firmware V1.5, Issue 1, is the external-control spec for an AHM processor. Control is on the network socket on the rear of the unit. The payload is MIDI. Every message number in the document is hexadecimal.

A client uses one of two TCP ports. Without encryption the rendezvous port is 51325. With TLS/SSL it is 51327. The authentication section applies when the TLS/SSL socket is opened. The first data sent is the message `UserProfile, UserPassword`, with `UserProfile` from `00` to `1F`. If the username and password match, the unit replies with the six characters `AuthOK`. Otherwise the connection is dropped.

Channels are selected with a MIDI channel number `N` and a note number `CH`. Inputs 1 to 64 use `N = 0` and `CH` from `00` to `3F`. Zones 1 to 64 use `N = 1` and the same `CH` range. Control groups 1 to 32 use `N = 2` and `CH` from `00` to `1F`. Rooms 1 to 16 use `N = 3` and `CH` from `00` to `0F`. Input 1 is therefore `N = 0`, `CH = 00`, and the note-on status byte is `90`.

Mute on is a note-on with velocity greater than `40`, followed by a note-off: `9N, CH, 7F, 9N, CH, 00`. Mute off uses velocity less than `40`: `9N, CH, 3F, 9N, CH, 00`. On messages the unit receives, velocity `00` and note-off are ignored. Velocity `01` to `3F` is mute off. Velocity `40` to `7F` is mute on.

Channel level is an NRPN with parameter ID `17`. The value `LV` runs from `00` to `7F`, which the document maps from −inf to +10 dB and then points at its table. The set message is `BN, 63, CH, BN, 62, 17, BN, 06, LV`. A get is a SysEx. The header on every SysEx in the spec is `F0, 00, 00, 1A, 50, 12, 01, 00` (major version `01`, minor version `00`). The get-level body is `0N, 01, 0B, 17, CH, F7`, and the unit then transmits the level message.

Preset recall is bank select plus program change, for 500 presets in four banks. The unit also transmits this message when a preset is recalled. Presets 1 to 128 use `B0, 00, 00, C0, SS` with `SS` from `00` to `7F`. Presets 129 to 256 use bank `01`. Presets 257 to 384 use bank `02`. Presets 385 to 500 use bank `03`, and `SS` runs from `00` to `73`. Preset 1 is `SS` `00`, written `B0, 00, 00, C0, 00`.

The same document covers input trim, preamp gain, pad, phantom power, sends, audio-file playback, source selectors, room combiners, and channel names. This entry stays on mute, level, and preset recall.

## How to set it up

1. Connect to the AHM network socket. Use TCP 51325 for the unencrypted port, or TLS on 51327. On the TLS socket, send `UserProfile, UserPassword` first, with the profile byte from `00` to `1F`, and wait for the six characters `AuthOK`.
2. Mute input 1 with the hex bytes `90 00 7F 90 00 00`. Mute it off with `90 00 3F 90 00 00`. Zone 1 uses `N = 1`, so the status byte is `91` and the note is still `00`.
3. Read the level before you write one. For input 1 the get is SysEx `F0 00 00 1A 50 12 01 00 00 01 0B 17 00 F7`. Set it with `B0 63 00 B0 62 17 B0 06 LV`. `LV` is one byte from `00` to `7F`, mapped from −inf to +10 dB. Use the dB table at the end of the PDF for the byte you want.
4. Recall preset 1 with `B0 00 00 C0 00`. Recall preset 129 with `B0 00 01 C0 00`. Stay inside the bank the document assigns. Preset 500 is bank `03`, `SS` `73`.
5. Leave preamp phantom power and the pad alone from an unattended client. They are NRPN IDs `1B` and `1A` in the same section as level.

Source: [AHM TCP/IP Protocol V1.5 (PDF)](https://www.allen-heath.com/content/uploads/2024/10/AHM-TCP-Protocol-V1.5.pdf)

## FAQ

### Which port is the AHM, and which message table goes with it?
This page follows the AHM TCP/IP Protocol, firmware V1.5. Avantis has its own MIDI-over-TCP article, and that article also uses TCP 51325. Use the message table that matches the hardware in the rack.

### Is preset 1 program change 1?
The document maps presets 1 to 128 onto `SS` values `00` to `7F`. Preset 1 is `B0, 00, 00, C0, 00`.

### Does the trailing note-off undo the mute?
The mute command is specified as a note-on plus a note-off. The received-message rules say velocity `00` and note-off are ignored. Velocity `7F` is mute on, and velocity `3F` is mute off.
