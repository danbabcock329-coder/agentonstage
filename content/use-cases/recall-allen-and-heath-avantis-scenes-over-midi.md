---
title: "Recall Allen & Heath Avantis scenes over MIDI"
slug: recall-allen-and-heath-avantis-scenes-over-midi
category: "Audio"
tools: ["Allen & Heath Avantis", "MIDI"]
difficulty: Advanced
source_url: https://support.allen-heath.com/hc/en-gb/articles/45146889174801-Avantis-MIDI-TCP-IP-Protocol
summary: "Avantis firmware V2.0 and later accepts MIDI over TCP port 51325, covering faders, mutes, strip names, and recall of one of 500 scenes from a single client connection."
---

## What it does

Allen & Heath's Avantis MIDI TCP/IP protocol article, updated 10 April 2026, applies to firmware V2.0 and later. The mixer takes control on its network port. The payload is MIDI, and the client uses TCP port 51325. Message numbers in the article are hexadecimal.

Avantis uses MIDI running status. When the next message has the same status byte, that byte can be omitted. The article's mute example for inputs 1, 2, and 3 on MIDI channel 12 is `9B 00 7F, 9B 01 7F, 9B 02 7F` without running status, and `9B 00 7F, 01 7F, 02 7F` with it. Status `9B` is note-on on channel 12.

Five MIDI channels select the strip type. The base channel N is set in Utility / Control / MIDI. It cannot be higher than 12, and the default block is channels 12 through 16. Scene recall and MIDI Machine Control use N. Inputs 1 to 96 use channel N and note numbers `00` to `5F`. Mono groups 1 to 54 use N+1 and notes `00` to `35`. Stereo groups 1 to 27 use N+1 and notes `40` to `5A`. Mono auxes 1 to 54 and stereo auxes 1 to 27 use the same note split on N+2. Mono and stereo matrices use it on N+3. Channel N+4 carries mono FX sends 1 to 12 on notes `00` to `0B`, stereo FX sends on `10` to `1B`, FX returns on `20` to `2B`, mains 1 to 3 on `30` to `32`, DCA 1 to 16 on `36` to `45`, and mute groups 1 to 8 on `46` to `4D`. The same offset also lists stereo UFX sends and returns. The article's channel table is the full note map.

Mutes are a note-on followed by a note-off. Mute on sends velocity `7F`, then `00`. Mute off sends velocity `3F`, then `00`. On the way in, velocity `00` and note-off are ignored, velocities `01` to `3F` mean mute off, and `40` to `7F` mean mute on.

Faders are NRPN parameter `17`. The article writes the three control changes as `BN 63 CH`, `BN 62 17`, `BN 06 LV`. LV runs from `00` to `7F`, which the article maps from negative infinity to +10 dB. Assignment to the main mix is NRPN `18`, on for values `40` to `7F` and off for `00` to `3F`. DCA and mute-group assignment share NRPN `40`, with the on and off values in the article's tables.

SysEx messages share the header `F0 00 00 1A 50 10 01 00`. Aux, FX, and matrix send levels are a SysEx that names the source strip and the destination mix. A channel name is at most eight characters, which is what the strip LCD can show. A name request is the header plus `0N 01 CH F7`. The reply is `0N 02 CH` plus the ASCII name. A name write uses `0N 03 CH`. Colour uses `04` to read and `06` to write, and the colour byte runs from `00` to `07`.

Scenes are a bank select and then a program change on the base channel: `BN 00 Bank`, `CN SS`. Four banks cover 500 scenes. Bank `00` is scenes 1 to 128, `01` is 129 to 256, `02` is 257 to 384, and `03` is 385 to 500. SS is the scene inside the bank, `00` to `7F`. The desk also sends that pair when a scene is recalled from the screen. The article also lists custom messages on MIDI strips and press and release messages on softkeys.

## How to set it up

1. Confirm the Avantis is on firmware V2.0 or later. In Utility / Control / MIDI, read the base channel. The default block is 12 to 16, and the base cannot be set above 12.
2. Open a TCP connection to the mixer's network-port address on port 51325. Send MIDI bytes on that socket.
3. For a fader, send NRPN parameter `17` on the MIDI channel for that strip type, with the note number selecting the strip. LV `00` is negative infinity and `7F` is +10 dB.
4. For a mute, send note-on with velocity `7F` and then note-off to mute, or velocity `3F` and then note-off to unmute. A bare note-off does not change the mute. The article says those messages are ignored.
5. To recall a scene, send bank select and then program change on the base channel. Use the article's bank table for scenes 129 to 500. The desk echoes the same pair when someone recalls a scene on the surface.

Source: [Avantis MIDI TCP/IP protocol](https://support.allen-heath.com/hc/en-gb/articles/45146889174801-Avantis-MIDI-TCP-IP-Protocol).

## FAQ

### Which port does an Avantis client open?
TCP 51325 on the mixer's network port, for firmware V2.0 and later. The article describes MIDI messages on that socket.

### Will a note-off clear a mute?
The article says velocity `00` and note-off messages are ignored on the way in. Mute off is a note-on with velocity `01` to `3F`. The transmit example uses velocity `3F`, then a note-off.
