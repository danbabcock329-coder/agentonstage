---
title: "Local Whisper-powered live captions for services and events"
slug: local-whisper-powered-live-captions-for-services-and-events
category: "Audio"
tools: ["Whisper", "OBS"]
difficulty: Beginner
source_url: https://github.com/Church-Cap/Live-Church-Captions
summary: "Church Cap runs local Whisper captions from one audio feed, serves them to phones on venue Wi-Fi, and can add an OBS browser source."
---

## What it does

Church Cap runs local Whisper captions from one audio feed, serves them to phones on venue Wi-Fi, and can add an OBS browser source. It stays on the venue network.

## How to set it up

1. Install Church Cap from the latest GitHub release (START_HERE.md is the non-technical guide).
2. Feed it one audio feed from the desk or an audio interface.
3. Share the QR code so guests can read captions on their phones over local Wi-Fi, and add the OBS browser source for the stream.

Source project: [Church-Cap/Live-Church-Captions](https://github.com/Church-Cap/Live-Church-Captions)

## FAQ

### Does it need the cloud?
No. It is local-first and serves captions over the local network.

### Only for churches?
It's built for services, but any single-feed event (keynotes, panels) works the same way.
