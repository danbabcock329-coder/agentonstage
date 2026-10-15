---
title: "Import timecode cue lists into ETC Eos over OSC"
slug: import-timecode-cue-lists-into-etc-eos-over-osc
category: "Show Control"
tools: ["ETC Eos", "CuePoints", "OSC", "Timecode"]
difficulty: Intermediate
source_url: https://rsmck.co.uk/blog/eos-osc-timecode-companion/
summary: "rsmck's EOS Timecode Companion takes a CuePoints export or any tab-delimited CSV and writes the timecode events into an Eos show over OSC, with no USB sticks."
---

## What it does

rsmck's EOS Timecode Companion takes a CuePoints export or any tab-delimited CSV and writes the timecode events into an Eos show over OSC, with no USB sticks.

## How to set it up

1. Export your timecode cue points as a tab-delimited CSV (the post says not to use the Eos export option).
2. Run the cross-platform Electron app and point it at ETCnomad or a networked console.
3. Import the events, then review the timecode list on the desk.

Source: [Blog post by rsmck](https://rsmck.co.uk/blog/eos-osc-timecode-companion/)

## FAQ

### Does it work with CuePoints 2.0?
This version is kept for CSV and CuePoints 2.0 workflows. A separate CuePoints-1.x version is linked from the post.

### Multiple timecodes per cue?
Not supported at the time of the post.
