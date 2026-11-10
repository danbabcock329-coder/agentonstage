---
title: "Drive REAPER playback over OSC"
slug: drive-reaper-playback-over-osc
category: "Audio"
tools: ["REAPER", "OSC"]
difficulty: Intermediate
source_url: https://www.reaper.fm/sdk/osc/osc.php
labels: ["Commercial product"]
summary: "REAPER's default OSC pattern file plays, stops, and mutes tracks. Add an OSC control surface, then send /play or /track/3/mute 1."
---

## What it does

Cockos documents OSC as a control-surface device inside REAPER. The SDK page says you add it under Options, Preferences, Control Surfaces. REAPER can receive, send, or both. For anything past action shortcuts and FX learn, the messages are defined by a pattern config file, `.ReaperOSC`. The page tells you to open that folder from the pattern-config control ("open config directory") and to copy `Default.ReaperOSC` rather than edit the original.

The default file's own comments, which point back at the Cockos OSC page, define how an argument prefix is read. `t` is a trigger or toggle: the device sends the address alone, or with 1. `b` is binary, 0 or 1, and it sets or clears a state. `n` is a normalized float from 0 to 1. `f` is a raw float. `i` is an integer sent to REAPER. `s` is a string.

Transport in the default file is `PLAY t/play`, `STOP t/stop`, `PAUSE t/pause`, and `RECORD t/record`. So `/play` or `/play 1` is the play pattern, and the same shape is used for stop, pause, and record. The file is explicit that a `t` message toggles or triggers. It does not describe `/play` as a "force into play" command. Markers are `GOTO_MARKER i/marker t/marker/@`: the comments' pattern for this integer form is `/marker 2` or `/marker/2`. Regions use `/region` the same way.

The mute example in the file is the one to trust for level and state. `TRACK_MUTE b/track/mute b/track/@/mute` means `/track/3/mute 1` mutes track 3, and `/track/3/mute 0` unmutes it. `/track/mute 1` mutes whichever track is selected in the device. Solo is the same shape on `/track/3/solo`. Volume is `TRACK_VOLUME n/track/volume n/track/@/volume`: `/track/3/volume 0.5` puts the fader in the middle of its travel, not at 0 dB. The comment says the dB that corresponds to that position depends on REAPER's fader preference. A separate pattern, `f/track/@/volume/db`, carries a raw dB float. Name changes are `s/track/@/name`: `/track/3/name` with the string `vox` renames track 3.

Track numbers are not always the project order. `DEVICE_TRACK_COUNT` in the default file is 8, the bank size. The integer-argument comment says that if the device selects bank 2, `/track/1/volume` is track 9, and feedback comes back only for tracks 9–16. The file also warns that the default patterns include a lot of feedback (time, beats, VU, FX parameters) and that you should comment out what you do not need so the sender is not flooded.

An action command ID is `ACTION i/action t/action/@`. The file's example is `/action 40757` or `/action/40757`, which it names as "split items at edit cursor". Other IDs come from REAPER's actions window.

## How to set it up

1. In REAPER, open Options, Preferences, Control Surfaces, and add an OSC control surface. Set it to receive, or to send and receive if you want mute and fader feedback. Match the device IP and the local listen port to the machine that will send.
2. Under pattern config, open the config directory, copy `Default.ReaperOSC`, and select the copy. Leave the original in place. The SDK page says that is how a custom pattern is made.
3. Confirm the bank. With the default device track count of 8, `/track/3/mute` is track 3 only while bank 1 is selected. Select bank 2 and `/track/1` moves to track 9.
4. Send `/play` or `/play 1`, then `/stop` or `/stop 1`. Mute track 3 with `/track/3/mute 1` and unmute with `/track/3/mute 0`. Set the fader with `/track/3/volume` and a float from 0 to 1, or use `/track/3/volume/db` when you need a raw dB value.
5. Comment out `TIME`, `BEAT`, `VU`, and `FX_PARAM` patterns in your copy if the assistant only needs transport and mutes. The default file says those feedback messages can flood the device.

Source: [REAPER OSC SDK](https://www.reaper.fm/sdk/osc/osc.php). The patterns and the mute, volume, and action examples are the comments in `Default.ReaperOSC`, the file that page tells you to copy. A copy of that default file is in [Ultraschall's portable REAPER bundle](https://github.com/Ultraschall/ultraschall-portable/blob/master/Plugins/Default.ReaperOSC).

## FAQ

### Does /track/3/volume 0.5 set the fader to 0 dB?
No. The default file says 0 is the bottom of the fader, 1 is the top, and 0.5 is the middle of that travel. The dB value depends on REAPER's fader preference. The raw dB pattern is `/track/3/volume/db`.

### Is /play a latch that forces playback on?
The pattern type is `t`, which the file defines as trigger or toggle: send the address with no argument, or with 1. Use `/stop` when you need the stop pattern. Read the transport in REAPER before you send `/play` again.

### Why did /track/1/mute hit the wrong channel?
The default device shows 8 tracks at a time. The file's bank example says that once bank 2 is selected, `/track/1/volume` targets track 9. The default pattern for that selection is `i/device/track/bank/select`: `/device/track/bank/select 2`, or `/device/track/bank/select/2`.
