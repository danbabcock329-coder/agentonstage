---
title: "Move d&b Soundscape objects on a DS100 over OSC"
slug: move-d-and-b-soundscape-objects-on-a-ds100-over-osc
category: "Audio"
tools: ["d&b DS100", "d&b Soundscape", "OSC"]
difficulty: Intermediate
source_url: https://www.dbaudio.com/assets/products/downloads/manuals-documentation/electronics/dbaudio-osc-protocol-ds100-1.3.12-en.pdf
summary: "A DS100 or DS100M listens for OSC on UDP 50010, places an En-Scene sound object in meters, and recalls an R1 scene, with replies on port 50011."
---

## What it does

d&b's OSC protocol for the DS100, specification DOC05325 version 1.3.12 dated 13 March 2026, is the OSC map for the DS100 and DS100M in addition to AES70/OCA. Transport is UDP. The processor listens on port 50010 and sends replies on port 50011. OSC is advertised over DNS-SD as `_osc._udp`.

Addresses start with `/dbaudio1`. A write includes a value. A read is the same address with no value, and the reply repeats the address with the current value. The document's crosspoint example sends `/dbaudio1/matrixnode/enable/22/33` with int 1 to turn that node on. OSC patterns are part of the spec. `?` matches one character, `*` matches a run of characters, square brackets match a character class, and curly braces match one of several strings. The document warns that the class is applied per character: `/dbaudio1/matrixoutput/mute/2[4-9]` with int 1 mutes outputs 24 through 29, while a class written as `[26-74]` does not mean outputs 26 through 74.

Matrix size depends on the active license and the sample rate. The document lists both DS100 and DS100M as 64 by 24 at 48 or 96 kHz, 64 by 64 at 48 or 96 kHz, or 128 by 64 at 48 kHz. `/dbaudio1/status/matrixinputcount` and `/dbaudio1/status/matrixoutputcount` return the active counts. `/dbaudio1/status/audionetworksamplestatus` returns 4 at 48 kHz, 6 at 96 kHz, and 1 when the rate is not in sync. The firmware read in the table is `/dbaudio1/fixed/firmwareversion`. The sample replies are `DS100 V3.02.02` and `DS100M V3.02.02`.

Input and output gain run from -120.0 to 24.0 dB. A matrix crosspoint gain runs from -120.0 to 10.0 dB. Mute, delay enable, EQ enable, and polarity are 0 or 1. Delay is 0.0 to 500.0 ms. The device name and channel names can be written, and the document says R1 overwrites them while R1 is connected. `/dbaudio1/device/clear` is write-only. It resets the device to factory defaults except the remote settings.

En-Scene positioning is present only when that option is enabled. `/dbaudio1/positioning/source_enable/{input}` is a read: 0 means the input is a matrix channel, and 1 means it can be used as a sound object. Position in meters from the project origin is `/dbaudio1/positioning/source_position/{input}` with three floats, x, y, and z. The document's example places object 42 at x -3.5 m, y 4.2 m, z 0 m. `/source_position_xy` sends x and y only. Spread is `/source_spread`, from 0.0 to 1.0 in steps of 0.01, default 0.5. Delay mode is `/source_delaymode`: 0 is off, 1 is tight, and 2 is full. Four coordinate-mapping areas take a position in that area's own scale, and the document says the area has to be defined before a mapped read or write answers. Function groups are numbered 1 to 32. Gain from a sound object into a function group runs from -120.0 to 10.0 dB.

Scenes are created in R1 and recalled over OSC. `/dbaudio1/scene/next` and `/dbaudio1/scene/previous` are writes that step. `/dbaudio1/scene/recall` with one int, from 0 to 999, recalls that major number at .00, so 7 recalls scene 7.00. Two ints are major and minor, minor up to 99. The example `/dbaudio1/scene/recall` with 777 and 95 recalls scene 777.95. `/dbaudio1/scene/sceneindex`, `/scenename`, and `/scenecomment` are reads. En-Space room choice is `/dbaudio1/matrixsettings/reverbroomid`. 0 is off. 1 through 9 select the built-in rooms named in the document. 101, 102, and 103 select custom rooms only after a room has been uploaded.

## How to set it up

1. Send UDP OSC to the DS100 on port 50010. Listen on 50011 when you need the reply. En-Scene and En-Space addresses in the document apply only when that option is enabled.
2. Read `/dbaudio1/fixed/firmwareversion` and the matrix input and output counts before you assume a channel number exists.
3. To place an object, read `source_enable` for that input. When the reply is 1, send `/dbaudio1/positioning/source_position/{n}` with x, y, and z in meters.
4. Recall a scene that already exists in the R1 project. One argument is major.00. Two arguments are major and minor. Use `next` and `previous` to step.
5. Leave `/dbaudio1/device/clear` unused on a show processor. The document says it returns the device to factory defaults except the remote settings. Names written over OSC are overwritten while R1 is connected.

Source: [d&b DS100 OSC protocol 1.3.12](https://www.dbaudio.com/assets/products/downloads/manuals-documentation/electronics/dbaudio-osc-protocol-ds100-1.3.12-en.pdf).

## FAQ

### Does a position write work on every input?
En-Scene has to be enabled, and that input has to be a sound object. `source_enable` is the read. A reply of 0 means the input is still a matrix channel.

### Can one message mute a range of outputs?
Yes, with an OSC pattern, and the pattern matches per character. The document's example `/dbaudio1/matrixoutput/mute/2[4-9]` with int 1 mutes outputs 24 through 29.
