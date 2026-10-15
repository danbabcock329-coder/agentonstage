---
title: "Generate hundreds of sequential show control cues in QLab"
slug: generate-hundreds-of-sequential-show-control-cues-in-qlab
category: "Show Control"
tools: ["QLab", "AppleScript", "OSC", "MIDI/MSC"]
difficulty: Intermediate
source_url: https://qlab.app/cookbook/show-control-cues-generator/
summary: "A QLab Cookbook workspace with script-cue generators for OSC, QLab-format OSC, MSC and MIDI program change cues. It saves hours of typing when QLab drives consoles or media servers."
---

## What it does

A QLab Cookbook workspace with script-cue generators for OSC, QLab-format OSC, MSC and MIDI program change cues. It saves hours of typing when QLab drives consoles or media servers.

## How to set it up

1. Download the example workspace for your QLab version from the cookbook page.
2. Set up the template cue with the destination patch and message; for custom OSC put $$$ where the number should go (e.g. /track$$$/connect).
3. Run the generator's Script cue and answer the prompts for count, start value, increment and number format.
4. Copy the generated cues into your show workspace.

Source: [QLab Cookbook (Figure 53)](https://qlab.app/cookbook/show-control-cues-generator/)

## FAQ

### Does it work in QLab 5?
Yes. It was written for QLab 3, and the page explains the QLab 4/5 changes (OSC cues became Network cues) and provides QLab 5 downloads.

### Where does AI fit?
An agent can draft the template values and counts from your paperwork, while the tested generator script creates the actual cues.
