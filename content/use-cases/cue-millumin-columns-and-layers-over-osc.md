---
title: "Cue Millumin columns and layers over OSC"
slug: cue-millumin-columns-and-layers-over-osc
category: "LED/Video"
tools: ["Millumin", "OSC"]
difficulty: Intermediate
source_url: https://github.com/anome/millumin-dev-kit/wiki/OSC-documentation
summary: "Millumin V5 takes column launches, layer geometry, and media transport over OSC, and can send column and property feedback once API feedback is enabled."
---

## What it does

Millumin's developer wiki documents an OSC API for version 5, with separate pages for V1 through V4. An address and its arguments are separate. The wiki says a `/millumin` prefix is optional on the way in, so `/millumin/test/opacity` and `/test/opacity` do the same thing, and that feedback always uses the `/millumin` prefix. Addresses are case insensitive.

Column transport is a set of `/action` messages. `launchColumn` and `launchOrStopColumn` take a column index or a name. The wiki's example sends `11` to launch the 11th column, and `"test"` to launch the column named test. `stopColumn`, `launchPreviousColumn`, and `launchNextColumn` take no argument in the action list. `play`, `pause`, `playOrPause`, and `goToTime` apply to dashboard media and, in the same section, to the timeline being edited. `goToTime` accepts seconds, a negative offset from the end, or a string such as `01:02:03.456`. `selectBoard`, `selectLayer`, and `selectLight` take an index or a name.

Layers, lights, and media are addressed by name, by `layer:` or `light:` plus a name, by `index:` plus the index shown in Preferences, or by `selectedLayer` and `selectedLight`. The wiki shows opacity as 0.75 for 75%, position, rotation, scale, the four mapping corners, and effect parameters by effect index (`effect1`, `effect3`). A `/+` or `/-` suffix adds or subtracts. Lights take an intensity. Media can take a playhead time, a normalized time, a speed, text, or a Quartz input. `startMedia`, `pauseMedia`, `startOrPauseMedia`, and `stopMedia` control the clip. `import` and `importAndStart` load a file path onto a layer or a column. Masters are `/masterVideo`, `/masterAudio`, and `/masterDMX`.

The same action list includes show-wide calls: enter or leave fullscreen, show or hide the test card, disable or enable the workspace, open or save a project from a path, and `quit`. `/ping` asks Millumin to describe every layer.

Feedback is off until you enable it. The wiki says to open the Device manager with Command-K, choose the OSC tab, and check API feedback. Launched and stopped columns come back as `/millumin/board/launchedColumn` and `stoppedColumn` with an index and, when the column has a name, that name. Media start, pause, and stop are reported per layer. A `/?` suffix asks for one property. The Devices help page says the OSC listener's input port is the one you set there.

## How to set it up

1. In Millumin, open the Device manager, select the OSC listener, and note the interface and input port. The wiki's terminal test sends to `127.0.0.1` port 5000.
2. That test is a plain string, not a binary OSC packet. The wiki says Millumin will interpret `echo -n "/selectedLayer/opacity 0.5" | nc -4u -w1 127.0.0.1 5000` as OSC. An agent should send real OSC from a library, with the address and the arguments split.
3. Launch a named column with `/action/launchColumn` and the column name. Use the index only after you have checked it against the board.
4. Turn on API feedback if the agent needs to see which column launched. Read `/millumin/board/launchedColumn`, or ask `/selectedLayer/opacity/?` for one value.
5. Keep `/action/quit`, `/action/openProject`, and `/selectedLayer/import` off a live show. They are in the same action list as go.

Source: [Millumin V5 OSC documentation](https://github.com/anome/millumin-dev-kit/wiki/OSC-documentation) and the [OSC devices help page](https://help.millumin.com/docs/connect/devices/).

## FAQ

### Does the `/millumin` prefix have to be on every command?
The V5 wiki says incoming messages work with or without that prefix. Messages Millumin sends back always start with `/millumin`. The page is marked for V5. V4 and earlier have their own wiki pages.

### Will a string from netcat work as a cue?
The wiki's netcat line is a connectivity test. It says the terminal command does not send OSC, and that Millumin interprets that string as OSC. A show controller should send OSC packets to the listener port set in the Device manager.
