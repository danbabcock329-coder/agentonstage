---
title: "Jump Isadora scenes from OSC"
slug: jump-isadora-scenes-from-osc
category: "LED/Video"
tools: ["Isadora", "OSC"]
difficulty: Intermediate
source_url: https://support.troikatronix.com/support/solutions/articles/13000072174-triggering-cues-in-isadora-from-qlab
labels: ["Commercial product"]
summary: "Isadora listens on port 1234 for /isadora/1 through /isadora/99. An OSC Listener on that channel can jump to the next scene, with a fade."
---

## What it does

TroikaTronix's support article "Triggering Cues in Isadora from QLab" (modified 14 June 2021) shows how a network cue fires a scene change inside Isadora. The OSC addresses `/isadora/1` through `/isadora/99` are built into Isadora. The article says the name uses a small "i", and a capital "I" will not match.

Every message needs an argument after the address. The article says Isadora will not see the trigger if that argument is missing. You do not have to use the value. It still has to be there. The article's examples send `/isadora/1` with argument `1`, then the same address with argument `2`.

On the Isadora side, the active scene gets an OSC Listener actor. Its `channel` input is the number in the address. `/isadora/1` stays on channel 1. `/isadora/37` means channel 37. When a message arrives, the trigger output pulses from `-` to `X`, and the argument shows up on the `value` output.

The article's QLab patch is only the sender. Open the workspace settings, choose Network, and name a patch Isadora. The same computer uses destination `localhost`. Another computer uses the IP shown at the bottom left of Isadora's preferences. The port after that address is 1234.

A Jump actor does the scene change. Connect the listener's trigger output to the Jump actor's trigger input. The article calls this a jump to the next scene. A number of seconds on the Jump actor's `fade` input crossfades. Leave `fade` alone for a cut. The article also wires the same trigger to a Speak Text actor, with the text `got it`, as an audible check that the packet arrived.

## How to set it up

1. In the QLab network patch, or in whatever OSC client you use, send to port 1234. Use `localhost` when Isadora is on the same machine. Otherwise use the IP at the bottom left of Isadora's preferences.
2. In the active Isadora scene, add an OSC Listener. Set `channel` to the number in the address you will send. `/isadora/1` means channel 1.
3. Connect the listener trigger to a Jump actor trigger. Put a number of seconds in `fade` when the scene change should crossfade.
4. Send `/isadora/1` with an argument such as `1`. Keep the address in lowercase. A missing argument does not fire the trigger, even if you never read `value`.
5. Fire one test cue and watch the listener. The trigger output should pulse, and `value` should show the argument, before you leave Jump pointed at a live scene change.

Source: [Triggering Cues in Isadora from QLab](https://support.troikatronix.com/support/solutions/articles/13000072174-triggering-cues-in-isadora-from-qlab)

## FAQ

### Does the argument have to mean something?
The article says you do not have to use the value, and that Isadora will not see the trigger without some argument after the address. The argument is what appears on the listener's `value` output.

### What does the channel input match?
It matches the number in `/isadora/N`. The article leaves channel at 1 for `/isadora/1`, and says `/isadora/37` requires channel 37. Addresses run from `/isadora/1` through `/isadora/99`.

### Where does Jump land?
The article's step is "Use the Trigger to Jump to the Next Scene." It connects the listener trigger to the Jump trigger, and it uses the `fade` input, in seconds, for a crossfade.
