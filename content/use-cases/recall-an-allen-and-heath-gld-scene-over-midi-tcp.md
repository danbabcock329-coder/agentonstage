---
title: "Recall an Allen & Heath GLD scene over MIDI TCP"
slug: recall-an-allen-and-heath-gld-scene-over-midi-tcp
category: "Audio"
tools: ["Allen & Heath GLD", "MIDI", "TCP"]
difficulty: Advanced
source_url: https://www.allen-heath.com/content/uploads/2023/06/GLD-MIDI-and-TCPIP-Protocol-V1.4_2.pdf
labels: ["Commercial product"]
summary: "GLD MIDI protocol V1.4 wraps MIDI in TCP port 51325. Scene 1 is bank 00 then program 00. Input 1 mute on is note 20, velocity 7F, then note off."
---

## What it does

Allen & Heath's GLD MIDI and TCP/IP Protocol, firmware V1.4, issue 2, dated 25 February 2014, is the external-control spec for a GLD mixer running V1.4 or later. The opening note says the MIDI strip messages were added in V1.4, and that the other MIDI messages were available from V1.1. A second note says the socket preamp numbers changed in V1.4.

MIDI In and MIDI Out are on the rear panel. TCP/IP control is on the rear Network port and carries the same MIDI messages. Clients use TCP port 51325. The MIDI channel nibble inside those messages has to match the channel on Setup, Control, MIDI. This document does not print a TLS port or a login string. Every message number in the spec is hexadecimal.

The channel table is the note number `CH`. FX sends 1 to 8 are `00` to `07`. FX returns 1 to 8 are `08` to `0F`. DCA 1 to 16 are `10` to `1F`. Inputs 1 to 48 are `20` to `4F`. Mixes 1 to 20 are `60` to `73`. MIDI channel 1 is nibble `0`. The status byte uses `N` for that nibble, so channel 1 is `90` for note-on and `B0` for control change.

Mute on is a note-on with velocity greater than `40`, then a note-off: `9N, CH, 7F, 9N, CH, 00`. Mute off uses velocity less than `40`: `9N, CH, 3F, 9N, CH, 00`. On messages the mixer receives, velocity `00` and note-off are ignored. Velocity `01` to `3F` is mute off. Velocity `40` to `7F` is mute on. Input 1 is `CH` `20`, so mute on for input 1 on MIDI channel 1 is `90, 20, 7F, 90, 20, 00`.

A fader is an NRPN, parameter ID `17`. The level `LV` runs from `00` at negative infinity to `7F` at +10 dB. The three messages are `BN, 63, CH`, then `BN, 62, 17`, then `BN, 06, LV`. Send level uses parameter ID `20` to `3D` for mixes 1 to 30. The spec says groups and the main mix have no send level, and those messages are ignored. It also says the mix order follows the current mixer configuration and can change if that configuration changes.

Scene recall is a bank select and a program change, and the mixer also transmits it when a scene is recalled from the screen. There are 500 scenes in four banks. Scenes 1 to 128 use `BN, 00, 00` and then `CN, SS`, with `SS` from `00` to `7F`. Scene 1 is `SS` `00`. Scenes 129 to 256 use bank `01`. Scenes 257 to 384 use bank `02`. Scenes 385 to 500 use bank `03`, and `SS` runs from `00` to `73`.

Sysex messages start with `F0, 00, 00, 1A, 50, 10, 01, 00, 0N` and end with `F7`. A channel name is at most 8 characters, and the spec says at most 5 of those are shown on the strip LCD. The name query is that header, then `01, CH, F7`. The reply is the header, `02, CH`, the name, and `F7`. Phantom power is a different sysex. The query is the header, `0A`, the socket number, `F7`. The set is the header, `0C`, the socket, the value, `F7`, with off at `00` to `3F` and on at `40` to `7F`. dSNAKE sockets 1 to 24 are socket numbers `00` to `17`.

[Recall Allen & Heath AHM presets over TCP](/use-cases/recall-allen-and-heath-ahm-presets-over-tcp) also uses TCP port 51325 for MIDI. That page's V1.5 document adds TLS on port 51327 and an `AuthOK` login. This V1.4 document prints neither. Its input 1 is note `20`. That page's input 1 is note `00` on MIDI channel `0`.

## How to set it up

1. Read Setup, Control, MIDI on the GLD and use that MIDI channel as `N`. Open TCP to the Network port on 51325. This V1.4 document does not print a TLS port.
2. Read a name before you write a level. For input 1, `CH` is `20`. The name query is the sysex header, `01, 20, F7`. The reply uses `02` in that position.
3. Recall scene 1 on MIDI channel 1 with `B0, 00, 00` and then `C0, 00`. Scene 1 is bank `00` and program `00`. Scenes 129 to 256 are bank `01`. Do not send bank `03` with a program above `73`. The spec stops that bank at scene 500.
4. Mute input 1 with `90, 20, 7F, 90, 20, 00`. Unmute with velocity `3F` in the first note-on. A velocity of `00`, or a note-off by itself, is ignored on the way in.
5. Leave phantom power out of a scene recall. The 48V set is the sysex header, `0C`, the socket, then `40` to `7F` for on. Query with `0A` first. dSNAKE socket 1 is socket number `00`, and the spec says those socket numbers changed in V1.4.

Source: [GLD MIDI and TCP/IP Protocol, firmware V1.4, issue 2](https://www.allen-heath.com/content/uploads/2023/06/GLD-MIDI-and-TCPIP-Protocol-V1.4_2.pdf).

## FAQ

### Is scene 1 program change 1?
Scenes 1 to 128 are bank `BN, 00, 00` and program `CN, SS` with `SS` from `00` to `7F`. Scene 1 is `SS` `00`. On MIDI channel 1 the bytes are `B0, 00, 00` and then `C0, 00`. Bank `03` only runs through `SS` `73`, which the spec calls scene 500.

### Does this socket use the AHM login?
The AHM page linked above prints TCP 51325 and TLS 51327, and it prints the reply `AuthOK`. This GLD document prints TCP 51325 and does not print a TLS port or a login string. The note numbers also differ: GLD input 1 is `20`, and that page's input 1 is `00`.

### Which velocity mutes?
Mute on is a note-on with velocity greater than `40`, and the printed bytes use `7F`, followed by a note-off of velocity `00`. Mute off uses `3F`. Received velocity `00` and a bare note-off are ignored. Received velocity `01` to `3F` is mute off, and `40` to `7F` is mute on.
