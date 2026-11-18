---
title: "Fire DMXDesktop stacks over OSC"
slug: fire-dmxdesktop-stacks-over-osc
category: "Lighting"
tools: ["DMXDesktop", "OSC"]
difficulty: Intermediate
source_url: https://www.dmxdesktop.com/open-sound-control
labels: ["Commercial product"]
summary: "DMXDesktop takes OSC on port 8000 by default. /stack/{id}/go fires the next cue in that stack. OSC input is a paid feature and starts disabled."
---

## What it does

DMXDesktop publishes an OSC command table for its lighting desk. The OSC page says input listens on port 8000 by default, and that you pick UDP or TCP in Settings, General. Output defaults to `127.0.0.1:9000`. The same page says a discovery service runs on port 9000. OSC input requires a paid subscription and has to be enabled. Paths are case-sensitive.

Stack transport is the show-control set. `/stack/{id}/go` fires the next cue in that stack. `/stack/{id}/back` steps to the previous cue. `/stack/{id}/halt` freezes the current crossfade mid-transition. `/stack/{id}/stop` stops playback on that stack. `/stack/{id}/level` takes a float from 0 to 1 and sets the stack master. `/execute/{row}/{col}` triggers one execute-grid button. The page does not define how stack ids, rows, or columns are numbered, so those placeholders have to match the show file.

Live controls take no argument. The path itself is the command: `/live/blackout/on`, `/live/blackout/off`, or `/live/blackout/pulse`, and the same three endings for strobe, blinder, freeze, and fog. `/master/dimmer` takes a float from 0 to 1. `/effects/stop` stops every special effect. `/effects/{effect}/start` and `/effects/{effect}/stop` take one of wave, paparazzi, colorsweep, thunder, pulse, sparkle, or random. `/effects/bpm` takes a float from 0 to 1, and the page says that maps to 60–200 BPM.

Direct DMX is `/dmx/{universe}/{channel}` with a float from 0 to 1, which the page maps to 0–255. `/dmx/{universe}/{channel}/clear` clears one override. `/dmx/clear` clears every override.

Output is a separate subscription feature, documented from v1.0.46, on the output port. Examples include `/dmxdesktop/v1/blackout` as an int 0 or 1, `/dmxdesktop/v1/master` as a float 0–1, and `/dmxdesktop/v1/stack/{id}/step` as the step index. Live Wire mode, hold, and half or double tempo are documented from v1.0.52. `/livewire/mode/band`, `/livewire/mode/dj`, and `/livewire/mode/ambient` select that mode and start Live Wire if it is not already the running audio app. `/live/tempo/half` and `/live/tempo/double` latch, so sending the same one again returns to normal.

## How to set it up

1. In DMXDesktop, open Settings, General, OSC. Enable OSC input, pick the network interface, and leave the input port at 8000 unless the sender will use another port. Choose UDP or TCP and match the sender. The page says this input requires a paid subscription.
2. From the show-control machine, send `/master/dimmer` with a float from 0 to 1. Then send `/live/blackout/on` with no argument, and `/live/blackout/off` to release it.
3. Fire the next cue on a stack with `/stack/{id}/go`. Use `/stack/{id}/halt` to freeze a crossfade and `/stack/{id}/stop` to stop that stack. Set `/stack/{id}/level` from 0 to 1 for the stack master.
4. Hit one execute-grid cell with `/execute/{row}/{col}`. Start a named special effect with `/effects/wave/start`, or stop all of them with `/effects/stop`.
5. If you also enable OSC output, point it at the listener. The documented default is `127.0.0.1:9000`. Stack feedback arrives as `/dmxdesktop/v1/stack/{id}/step`, `/dmxdesktop/v1/stack/{id}/fading`, and `/dmxdesktop/v1/stack/{id}/paused`.

Source: [DMXDesktop Open Sound Control](https://www.dmxdesktop.com/open-sound-control).

## FAQ

### Is this QLC+?
[Drive QLC+ from Claude Desktop over WebSocket](/use-cases/drive-qlc-from-claude-desktop-over-websocket) talks to QLC+. The addresses on this page are DMXDesktop's OSC table, and the OSC page says input is a paid feature.

### Do the live buttons take a 0 or a 1?
The input table puts the state in the path. `/live/blackout/on`, `/live/blackout/off`, and `/live/blackout/pulse` are the three forms, and the parameter column for those rows says none. Output is different: `/dmxdesktop/v1/blackout` is an int, 0 or 1.

### Which tempo messages latch?
The page says `/live/tempo/half` and `/live/tempo/double` latch, so sending the same one again returns to normal. `/live/tempo/normal` returns the rig to normal. Those tempo commands are listed as available from v1.0.52.
