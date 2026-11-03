---
title: "Post show calls into Shure WAVETOOL chat over OSC"
slug: post-show-calls-into-shure-wavetool-chat-over-osc
category: "Audio"
tools: ["Shure WAVETOOL", "OSC", "QLab"]
difficulty: Beginner
source_url: https://content-files.shure.com/Pubs/wavetool/en-US/preferences.html
labels: ["Commercial product"]
summary: "WAVETOOL accepts chat OSC on UDP port 53005 when that preference is on. The guide's example is /wtchat/QLab/All with the string Intro video started."
---

## What it does

Shure's WAVETOOL preferences put chat on its own tab. Preferences > Chat includes the checkbox "Listen to chat OSC message on port 53005". With that selected, chat accepts OSC. The same line says a QLab network cue can send a message to one or more WAVETOOL chat members.

The format lines on that page are `/wtchat/` with a message string, and `/wtchatflash/` with a message string. The worked examples add two path segments before the string:

- `/wtchat/QLab/All` with the argument `Intro video started`
- `/wtchatflash/QLab/Foh` with the argument `SHOW IS ABOUT TO BEGIN!`

A separate checkbox, "Flash screen when chat message is received", blinks a red frame around the main window when a chat message comes in. The page lists that option next to the flash address. It does not say the `/wtchatflash/` address is the only thing that draws the frame.

The chat window has seven macro buttons. Their text is edited under the same Chat preferences, and each macro can be triggered by a MIDI message. The user guide's event log, Edit > Event Log, records OSC and MIDI activity along with alerts, so a cue that never appears in the chat still leaves a line there if WAVETOOL saw the packet.

A 16 May 2026 thread on r/livesound about Stream Deck use includes a theatre engineer who fires OSC into QLab and into Wavetool from the same surface, and describes the Wavetool side as chat macros. That is the show-caller version of the preference above. The addresses themselves are the ones in Shure's Chat preferences.

## How to set it up

1. In WAVETOOL, open Preferences (Command-P on the Mac guide) and select Chat. Turn on Listen to chat OSC message on port 53005.
2. In QLab, add a network cue aimed at the WAVETOOL computer on UDP port 53005. Use the guide's normal-message example: address `/wtchat/QLab/All`, string argument `Intro video started`.
3. For the guide's flash example, send `/wtchatflash/QLab/Foh` with the string `SHOW IS ABOUT TO BEGIN!`. Turn on Flash screen when chat message is received if the calling station should also blink the red frame.
4. Open Edit > Event Log when a cue does not show up in the chat window. The guide says that log includes OSC activity.

Source: [WAVETOOL Chat preferences](https://content-files.shure.com/Pubs/wavetool/en-US/preferences.html) and the [WAVETOOL user guide](https://www.shure.com/en-US/docs/guide/wavetool). The Stream Deck thread is [r/livesound, 16 May 2026](https://www.reddit.com/r/livesound/comments/1tey857/what_are_yall_using_streamdecks_for/).

## FAQ

### Can the port be changed?
The preference line names port 53005. The Chat page does not describe another port.

### Does this OSC path change RF or gain?
No. The addresses above are chat messages. Receiver inventory, RF, battery, and the SCP audio-fault detector are other parts of the user guide, not this listener.

### What do QLab, All, and Foh mean in the path?
The page prints them in the examples and says the cue sends a message to chat members. It does not publish a grammar beyond the two format lines and those two examples. Match the example, then confirm the message landed in the chat window.
