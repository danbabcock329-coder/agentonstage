---
title: "Automatic camera switching from audio with Gabin"
slug: automatic-camera-switching-from-audio-with-gabin
category: "Show Control"
tools: ["OBS", "Bitfocus Companion"]
difficulty: Intermediate
source_url: https://github.com/miroir-os/gabin
summary: "Switches cameras automatically based on who is talking, useful for panels and podcasts."
---

## What it does

Switches cameras automatically based on who is talking, useful for panels and podcasts.

## How to set it up

1. Download the latest release from the one-click-studio releases page.
2. Connect your audio API and OBS (or Companion).
3. Map each microphone to a camera shot so the active speaker drives switching.

Source project: [miroir-os/gabin](https://github.com/miroir-os/gabin)

## FAQ

### Known issues?
The README notes ASIO doesn't work with the XR32 mixer.

### Is there a CLI?
Yes, with debug and no-auto-open flags.
