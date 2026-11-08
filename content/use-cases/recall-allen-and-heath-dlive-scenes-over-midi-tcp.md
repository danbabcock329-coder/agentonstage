---
title: "Recall Allen & Heath dLive scenes over MIDI TCP"
slug: recall-allen-and-heath-dlive-scenes-over-midi-tcp
category: "Audio"
tools: ["Allen & Heath dLive", "MIDI"]
difficulty: Advanced
source_url: https://www.allen-heath.com/content/uploads/2024/06/dLive-MIDI-Over-TCP-Protocol-V2.0.pdf
labels: ["Commercial product"]
summary: "dLive firmware V2.0 takes MIDI over TCP. MixRack port 51325 recalls scene 1 as bank 00 and program 00. Mute on is note-on velocity 7F, then note-off."
---

## What it does

Allen & Heath's dLive MIDI Over TCP/IP protocol, marked firmware V2.0, sends MIDI on a TCP socket. The PDF says it applies to dLive systems on firmware V2.0 and later, and that control is available on any network port of the Surface or the MixRack. Message numbers in the PDF are hexadecimal.

The MixRack and the Surface do not share a port. A MixRack client uses TCP 51325 without encryption, or TCP 51327 with TLS/SSL. A Surface client uses TCP 51328 without encryption, or TCP 51329 with TLS/SSL. On the TLS socket, the first data sent is the message the PDF writes as `UserProfile, UserPassword`, where `UserProfile` is `00` to `1F`. A match is answered with the six characters `AuthOK`. Otherwise the connection is dropped.

dLive uses MIDI running status. The PDF's mute example for inputs 1, 2, and 3 on MIDI channel 12 is `9B, 00, 7F, 9B, 01, 7F, 9B, 02, 7F` without running status, and `9B, 00, 7F, 01, 7F, 02, 7F` with it. `9B` is note-on on channel 12. The bytes that running status omits are shown in the PDF in square brackets, such as `[9N]`.

The base MIDI channel N is the lowest channel of the range selected in Utility / Control / MIDI. The PDF maps MIDI channel 1 to 12 onto `0` to `B`. Preamp control, scene recall, and MIDI transport use N. Other strip types offset that channel, and the note number picks the strip. Inputs 1 to 128 stay on N, notes `00` to `7F`. Mono groups 1 to 62 use N+1 and notes `00` to `3D`. Stereo groups 1 to 31 use N+1 and notes `40` to `5E`. Mono auxes 1 to 62 and stereo auxes 1 to 31 use that same split on N+2. Mono matrices 1 to 62 and stereo matrices 1 to 31 use it on N+3. Channel N+4 carries mono FX sends 1 to 16 on `00` to `0F`, stereo FX sends 1 to 16 on `10` to `1F`, FX returns 1 to 16 on `20` to `2F`, mains 1 to 6 on `30` to `35`, DCA 1 to 24 on `36` to `4D`, and mute groups 1 to 8 on `4E` to `55`. The reference table is the full note map. Input 1 is note `00`.

Mute on is a note-on with velocity greater than `40`, then a note-off: `9N, CH, 7F, [9N], CH, 00`. Mute off uses velocity less than `40`: `9N, CH, 3F, [9N], CH, 00`. Incoming velocity `00` and note-off are ignored. Velocities `01` to `3F` mean mute off. Velocities `40` to `7F` mean mute on.

Faders are NRPN parameter `17`. The PDF writes `BN, 63, CH, [BN], 62, 17, [BN], 06, LV`. LV runs from `00` to `7F`. The reference table maps `00` to negative infinity and `7F` to +10 dB. Assignment to the main mix is NRPN `18`, on for `40` to `7F` and off for `00` to `3F`. The on example is `BN, 63, CH, [BN], 62, 18, [BN], 06, 7F`.

SysEx messages share the header `F0, 00, 00, 1A, 50, 10, MV, mV`, with major version `01` and minor version `00`. A channel-name write is that header plus `0N, 03, CH`, the name as hex ASCII, and `F7`. A name request is `0N, 01, CH, F7`, and the reply is `0N, 02, CH` plus the name.

Scene recall is MixRack only. It is a bank select and a program change, and the MixRack also transmits that pair when a scene is recalled from the screen. There are 500 scenes in four banks. Scenes 1 to 128 are `BN, 00, 00, CN, SS` with SS from `00` to `7F`. Scenes 129 to 256 use bank `01`. Scenes 257 to 384 use bank `02`. Scenes 385 to 500 use bank `03`, and SS runs from `00` to `73`. The reference table puts scene 1 at `00` and scene 500 at `73`. Cue-list recall is Surface only. It uses one of 2000 recall IDs: `BN, 00, RR, CN, SS`. The PDF says the Surface MIDI view in Scene Manager can show the string for a cue. Go, Next, and Previous are control changes whose number and value are set in Utility / Control / MIDI, and the PDF says some control numbers are already reserved.

## How to set it up

1. Confirm the dLive is on firmware V2.0 or later. In Utility / Control / MIDI, read the base channel N. The PDF's mute example uses channel 12, status `9B`, when the message is sent on channel 12.
2. Open TCP to the MixRack address on port 51325, or to the Surface on port 51328. For TLS, use 51327 or 51329 and send `UserProfile, UserPassword` first. Wait for `AuthOK` before any MIDI.
3. Mute input 1 with note-on velocity `7F` and then note-off on channel N, note `00`. Unmute with velocity `3F` and then note-off. A note-off by itself does not change the mute.
4. Recall scene 1 on the MixRack with bank select `BN, 00, 00` and program change `CN, 00`. Scene 129 is bank `01` and program `00`. Scene recall sent to the Surface port is the wrong target. Cue recall uses the Surface and a recall ID.

Source: [dLive MIDI Over TCP/IP Protocol V2.0](https://www.allen-heath.com/content/uploads/2024/06/dLive-MIDI-Over-TCP-Protocol-V2.0.pdf).

## FAQ

### Which socket recalls a scene, and which one recalls a cue?
Scene recall in this PDF is labeled MixRack only, on TCP 51325 or TLS 51327. Cue-list recall is labeled Surface only, on TCP 51328 or TLS 51329. Go, Next, and Previous are also Surface only, and they use the control-change number configured on the desk.

### Why did a mute message do nothing?
The PDF ignores velocity `00` and note-off. Mute on needs a note-on at velocity `7F` followed by a note-off. Mute off needs velocity `3F` followed by a note-off. The note number also has to match the strip type. Input 1 is note `00` on the base channel. Mute group 1 is note `4E` on channel N+4.

### What does bank 00, program 00 recall?
The reference table maps scene 1 to SS `00` in bank `00`. Scene 500 is SS `73` in bank `03`. The same bank and program pair is what the MixRack transmits when someone recalls that scene on the screen.

### Where do in-ear send levels live?
[Adjust Allen & Heath dLive in-ear mixes from an assistant](/use-cases/adjust-allen-and-heath-dlive-in-ear-mixes-from-an-assistant) is the Rust MCP server that sets named send levels. This page is the MIDI-over-TCP document for scene recall, mutes, faders, and the MixRack and Surface ports.
