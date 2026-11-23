---
title: "Switch Gig Performer songs over OSC"
slug: switch-gig-performer-songs-over-osc
category: "Audio"
tools: ["Gig Performer", "OSC", "UDP"]
difficulty: Intermediate
source_url: https://gigperformer.com/downloads/OSCMessages_3x.pdf
labels: ["Commercial product"]
summary: "Gig Performer OSC uses the plugin handle, as in /abc/SetParam 5 0.2. A 2021 article calls 54344 the default listen port unless Options changes it."
---

## What it does

Gig Performer's OSC reference, titled as of Gig Performer 3.0, is the address list for widgets, plugins, rackspaces, and songs. A widget address is `/oscHandle/SetValue` to set the value and `/oscHandle/GetValue` to read it. `/oscHandle/SetCaption` sets the caption from a string. A plugin uses `/oscHandle/SetParam` and `/oscHandle/GetParam` with an index, `/oscHandle/GetParamCount`, and `/oscHandle/SetPreset` with a preset number. The reference also lists `/RackSpace/SetVariation`, `/GigPerformer/NextSong`, `/GigPerformer/PrevSong`, `/SelectSongPart` with 0-based indexing, and `/GigPerformer/SwitchToSong` to switch to a song in the current setlist by name, with an optional part number or part name.

`/Play` starts the playhead. `/Panic` stops all MIDI and, sent again within 500 ms, also resets the audio engine. `/SetBPM` sets the tempo. `/SetMasterFader` sets the master fader. The reference does not print a port, a transport, or the numeric range for `/SetValue`.

Deskew's October 25, 2021 article, written for Gig Performer 4, says the `oscHandle` segment is replaced by the handle you assign. Its example is a plugin handle `abc` and the message `/abc/SetParam 5 0.2`, which sets parameter 5 of that plugin to 0.2. A MIDI In (OSC) block with the handle `MidiFromLocal` takes `/MidiFromLocal/Midi` and one to three bytes. The same article says the listening port is 54344 unless you changed it under Options, in the OSC section, and that OSC has to be enabled there. The September 2017 user guide, version 1.8, says that listening port is UDP and that the field was permanently 54344. The 2021 article is the later of the two and is the one that allows a changed port.

The 3.0 list also has `/GigPerformer/ListAllRackspaces`, `/RackSpace/ListOSCWidgets`, and `/Refresh` for a status update when the connection has been intermittent. `/RecordInputs` takes 1 to start and 0 to stop.

## How to set it up

1. In Gig Performer, open Options, OSC Setup, and enable OSC. Read the listening port on that screen. The 2021 article's default is 54344, and it says to use the number shown if you changed it. The 1.8 guide calls the transport UDP.
2. Give the plugin or widget a handle, and enable OSC on that block when the dialog offers it. The 2021 article's plugin example replaces `oscHandle` with `abc`.
3. Send `/abc/SetParam` with index 5 and value 0.2 only when 5 is the parameter you mean. Read `/oscHandle/GetParamCount` from the 3.0 list before assuming an index exists.
4. Change songs with `/GigPerformer/SwitchToSong` by the song name in the current setlist, or with `/GigPerformer/NextSong`. `/SelectSongPart` uses the 0-based index the reference names.
5. Treat a second `/Panic` inside 500 ms as the audio-engine reset the reference describes. One `/Panic` is the MIDI stop. Do not send the pair from a retry loop.

Source: [Gig Performer OSC reference as of 3.0](https://gigperformer.com/downloads/OSCMessages_3x.pdf), the [October 25, 2021 OSC article](https://gigperformer.com/using-midi-osc-blocks-to-send-midi-to-the-global-rackspace), and the [user guide v1.8 OSC section](https://www.gigperformer.com/downloads/docs/Gig%20Performer%20User%20Guide%201.8.pdf).

## FAQ

### Does the 3.0 PDF print the port?
It prints addresses and short descriptions. It does not print a port. The 2021 article says 54344 is the default listening port unless Options, OSC, shows a different one. The 1.8 guide says the listen port is UDP and was permanently 54344.

### What does /abc/SetParam 5 0.2 change?
The 2021 article says parameter 5 of the plugin whose handle is `abc` becomes 0.2. The 3.0 list writes that address as `/oscHandle/SetParam` and says it sets the parameter at the given index. The index is the plugin's, not a channel number on a console.

### What does a second Panic do?
The 3.0 line for `/Panic` says it stops all MIDI, and that sending it again within 500 ms also resets the audio engine. `/Play` is a different address. It starts the playhead.
