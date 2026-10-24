---
title: "Cue a Mitti playlist over OSC"
slug: cue-a-mitti-playlist-over-osc
category: "LED/Video"
tools: ["Mitti", "OSC"]
difficulty: Intermediate
source_url: https://imimot.com/help/mitti/external-controls/osc-udp-controls
summary: "Mitti listens on UDP 51000, starts the playlist with /mitti/play, and addresses a cue by number, by a six-character ID, or with current, next, previous, all, and selected."
---

## What it does

Imimot's Mitti help says OSC stays off until OSC Controls is enabled in Preferences. Mitti then listens on UDP port 51000. That same port runs an OSC Query server, so a browser opened at `http://localhost:51000` lists the address space of the playlist that is open. Commands that take no value are also accepted as plain UDP strings. Every address starts with `/mitti/`.

Master commands use `/mitti/{command}`. `/mitti/play` starts the playlist and takes no argument. `/mitti/togglePlay` does the same job with an int of 1, which the help points at for controllers that always send a value. The Mitti 2.8 notes add `/mitti/toggleVideoOutputs`, `/mitti/videoOutputsOn`, `/mitti/videoOutputsOff`, `/mitti/ping`, `/mitti/playCueWithCueID`, and `/mitti/{cueid}/setGotoToCueID`.

Cue commands use `/mitti/{cuenumber}/{command}`. `/mitti/1/opacity` changes the first cue. `/all/` hits every cue, `/selected/` hits the selection, and `current`, `previous`, and `next` follow the playhead, so `/mitti/current/opacity` and `/mitti/next/opacity` are both valid. From Mitti 2.8 a cue also has an ID of at most six uppercase characters. The default ID is the playlist index. The notes' example is `/mitti/INTRO/play` when the ID is INTRO. Video playback speed is `/mitti/{cuenumber}/playbackSpeed`. The 2.8 release notes treat that value as a percent: 100 is normal speed, 50 is half, and 200 is double, and the in and out points move to match the new speed.

Feedback goes to a separate target. When several commands control the same thing, Mitti sends the one that carries a value, so `/mitti/play` is never the feedback message and `/mitti/togglePlay` is. A numbered cue message is followed by the `current` form. Read-only feedback, which the help says cannot be sent back as control, includes `/mitti/time`, `/mitti/cueTimeLeft`, `/mitti/cueTimeElapsed`, `/mitti/previousCueName`, `/mitti/nextCueName`, `/mitti/currentCueName`, and `/mitti/currentCueTRT`. The time fields use `hh:mm:ss:ff`. `/mitti/resendOSCFeedback` repeats the current feedback set. The Resend button does the same thing.

The help says the full command list is whatever OSC Query returns for that playlist.

## How to set it up

1. In Mitti Preferences, enable OSC Controls. Confirm the show machine can reach UDP 51000. Open `http://localhost:51000` when you want the live address list.
2. Send `/mitti/play` with no argument to start the playlist, or `/mitti/togglePlay` with int 1 when the sender always attaches a value.
3. Address a cue by playlist number, or by a cue ID of up to six uppercase characters. `/mitti/1/opacity` changes the first cue. `/mitti/INTRO/play` plays the cue whose ID is INTRO.
4. Use `/all/`, `/selected/`, `current`, `previous`, or `next` when a fixed number is the wrong target. Set a video cue's speed with `/mitti/{cuenumber}/playbackSpeed` as a percent.
5. Turn on OSC feedback and point it at the listener when you need state back. Read the time and cue-name addresses from that stream. Call `/mitti/resendOSCFeedback` to refresh them.

Source: [Mitti OSC/UDP controls](https://imimot.com/help/mitti/external-controls/osc-udp-controls), [What's new in Mitti 2.8](https://imimot.com/help/mitti/whats-new/), and the [Mitti 2.8 release notes](https://imimot.com/blog/mitti-2-8-released).

## FAQ

### Does `/mitti/play` come back as feedback?
The help says feedback uses the form that carries a value. `/mitti/play` is not sent out. `/mitti/togglePlay` is, with the matching int.

### Where is the rest of the address list?
On the OSC Query server at `http://localhost:51000` while Mitti is running with OSC enabled. The help treats that list as the full set for the open playlist. The pages above document the addressing rules and the 2.8 additions.
