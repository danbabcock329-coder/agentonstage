---
title: "Place L-ISA sources and fire snapshots over OSC"
slug: place-l-isa-sources-and-fire-snapshots-over-osc
category: "Audio"
tools: ["L-ISA", "OSC", "Bitfocus Companion"]
difficulty: Intermediate
source_url: https://github.com/Ethereotek/companion-module-l-acoustics-l-isa
labels: ["Experimental"]
summary: "Unofficial Companion module 0.0.2 sends L-ISA OSC to UDP port 8880. /ext/src/1/p sets source 1 pan, and /ext/snap/1/f fires snapshot 1."
---

## What it does

Ethereotek's Companion module `l-acoustics-l-isa`, version 0.0.2, is an unofficial wrapper around L-ISA Controller OSC. The repository disclaimer says it is not developed, endorsed, certified, or supported by L-Acoustics, and that it should be tested in a non-live environment before a show. The author described it as a personal beta when posting the repo on the Companion module request.

The config hides the target port and the protocol. The port field's default is 8880. The protocol field's default is `udp`, labeled UDP (Default), with `tcp` and `tcp-raw` also in the choice list. The HELP page says those two values are static. You set the hostname. Listen for Feedback defaults to on and is also hidden. The feedback-port field is the one the HELP tells you to match to the device created in L-ISA Controller. The field definition does not ship a default port number.

Source parameters use OSC IDs 1 through 96. The action takes the first letter of the option id: pan is `p`, width is `w`, distance is `d`, elevation is `e`. The Aux option's id is `sub`, so its letter is `s`, not the word sub. An absolute send to source 1's pan is `/ext/src/1/p` with a float. The value option allows -1.0 to 1.0. When Relative is checked, the address gains an `r` before that letter, as in `/ext/src/1/rp`, and the float is the entered value added to the value stored in the module's session.

`/ext/snap/1/f` fires snapshot OSC ID 1 and sends no arguments. The id option runs from 1 to 999. Previous, current, and next are `/ext/snap/p/f`, `/ext/snap/c/f`, and `/ext/snap/n/f`, also with no arguments. Motion FX ids run from 1 to 32. Start, stop, and restart are `/ext/fx/1/start`, `/ext/fx/1/stop`, and `/ext/fx/1/restart`, with no arguments.

Mute sends an integer, 1 or 0. Master is `/ext/master/mute`. Monitor is `/ext/mon/mute`. User 1 and user 2 are `/ext/fader1/mute` and `/ext/fader2/mute`. The Reverb choice is special-cased to `/ext/rev/master/mute`. Fader position uses the same prefixes with `faderpos` and a float. The module adds the nudge, whose option allows -1.0 to 1.0, to its stored position and sends only when the result is between 0 and 1 inclusive.

The gain action's amount option allows -80.0 to 12.0. Relative, the default, adds that amount to the stored value. `normalize_gain` in `store.js` then computes 10 to the power of dB/20, multiplies by 100, floors, and divides by 100. That float is what goes out on `/ext/master/gain`, or `/ext/rev/master/gain` for reverb, and only when it lands between 0 and 1 inclusive.

Solo is `/ext/solo/src/1` with integer 1 or 0. Direct, distance gain attenuation, and distance HF attenuation are `/ext/config/src/1/direct`, `/ext/config/src/1/distatt/gain`, and `/ext/config/src/1/distatt/hf`. Early, cluster, and late reverb are `/ext/config/src/1/reverb/early`, `/cluster`, and `/late`. Those configuration sends also use integer 1 or 0.

The HELP says there are no feedbacks to assign to buttons. The module still listens and keeps `lisa_session`. In that JSON, source index 0 is OSC ID 1. `current_snap_id` is -1 when there is no snapshot or no OSC ID is set.

## How to set it up

1. Treat version 0.0.2 as a beta. The disclaimer says to test away from a live show. L-Acoustics does not support this module.
2. Point the module at the machine running L-ISA Controller. The hidden defaults are UDP and port 8880. Set the feedback port to the device you created in L-ISA Controller. The module does not document that device's port for you.
3. Read `lisa_session` before a move. Source index 0 in that variable is OSC ID 1. Confirm the id with the operator. The source-parameter action only addresses 1 through 96.
4. An absolute pan for source 1 is `/ext/src/1/p` plus a float from -1.0 to 1.0. Aux is `/ext/src/1/s` because the option id is `sub`. Relative sends `/ext/src/1/rp` and the float is the sum of the entered value and the stored value, not the delta alone.
5. Fire a snapshot only after the id is known: `/ext/snap/1/f` with no arguments when 1 is that id. `/ext/snap/n/f` is next. `/ext/fx/1/start` starts motion FX 1. Master mute is `/ext/master/mute` with integer 1 or 0.

Source: [Ethereotek/companion-module-l-acoustics-l-isa](https://github.com/Ethereotek/companion-module-l-acoustics-l-isa), version 0.0.2, including `companion/HELP.md`, `action-definitions/`, and `store.js`.

## FAQ

### Is port 8880 published by L-Acoustics on this repo?
The module's HELP calls 8880 and UDP static, and the hidden target-port field defaults to 8880. The disclaimer says the project is not an L-Acoustics product. The feedback port is separate and has no default in the config field.

### Why is Aux address /s and not /sub?
The source-parameter action uses the first character of the option id. The Aux choice is stored as `sub`, so the address letter is `s`. Pan, width, distance, and elevation use `p`, `w`, `d`, and `e`.

### What does the gain float represent?
The amount option is on a -80 to 12 range and the code adds it, when Relative is on, to the stored value before `normalize_gain`. That function is 10^(dB/20), times 100, floored, then divided by 100. The OSC argument is that result, not the decibel number, and it is sent only when it is between 0 and 1 inclusive.
