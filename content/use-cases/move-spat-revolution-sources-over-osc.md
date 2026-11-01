---
title: "Move SPAT Revolution sources over OSC"
slug: move-spat-revolution-sources-over-osc
category: "Audio"
tools: ["SPAT Revolution", "OSC"]
difficulty: Intermediate
source_url: https://www.flux.audio/knowledge-base/osc-control-and-commands/
labels: ["Commercial product"]
summary: "FLUX's SPAT Revolution OSC table moves source 1 with /source/1/aed, azimuth then elevation then distance. /snapshot/2/recall fires snapshot remote number 2."
---

## What it does

FLUX documents SPAT Revolution's OSC input in the SPAT preferences, and publishes the address table as a spreadsheet, "Spat Revolution OSC Guidelines and Table", from the OSC Control and Commands page. The connections chapter says a message looks like `/source/[remote number]/x`, and that the number is the virtual source's remote number. Up to eight connections can be inputs or outputs. Presets on that menu include SPAT plugins, SPAT Remote server, ADM-OSC, Lemur, Avid S6L, Digico, SSL Live, and SpaceMap Go. A custom preset needs its port set. The local address the chapter names is 127.0.0.1. Enable commands log, then Shift+F7, shows received and emitted messages in the log.

The spreadsheet's AED row, listed from version 1.1.0.48049, is `/source/(k)/aed`, a list of three floats. The description says the order is azimuth, elevation, then distance. It also accepts the shorter lists it writes as `[a, e]`, `[a, d]`, and `[a, d, e]`. The azimuth row is a float from -180 to 180 degrees, default 0. Elevation is -90 to 90 degrees, default 0. Distance is 0.01 to 100 meters, and the default cell is written `2,0`. `/source/(k)/xyz` is a list of three floats in x, y, z order. Each axis row is meters, from -100 to 100. The connections chapter says to automate Cartesian or polar, not both.

`/source/(k)/gain` is a float in decibels, minimum -144.5, maximum 24, default 0. `/source/(k)/mute` is a bool, and the description says 0 is muted and 1 is unmuted. The connections chapter says that since the 25.01 build a `/relative` segment adds to the current value, and its example `/source/1/relative/gain 1.0` adds 1.0 dB.

Snapshot recall is `/snapshot/(k)/recall`, listed from version 22.02.50148. The commentary marks the arguments optional. Time is the crossfade in seconds and defaults to 0. The same notes say the remote number can be `current`, `next`, or `previous`, and that `/snapshot/next/recall` recalls the next snapshot. `/global/project/snapshot/remotenumber/?` sends the list of snapshot remote numbers. `/source/*/dump` sends source parameters to the OSC outputs, and the spreadsheet's example `/snapshot/2/dump` dumps snapshot remote number 2.

`/snapshot/create`, `/snapshot/(k)/remove`, and `/snapshot/removeall` change the snapshot list. A recall client can leave those unused. Index as Arg, on the connection, moves the remote number into the arguments. With that option off, the number stays in the address, which is the form the spreadsheet prints.

## How to set it up

1. In SPAT Revolution, open Preferences and the OSC connection table. Use an input that speaks FLUX OSC grammar. The connections chapter lists ADM-OSC as its own preset, with a different grammar. Set the sender's IP, using 127.0.0.1 when the sender is on the same computer, and set a free port. Turn on Enable commands log and open the log with Shift+F7.
2. Confirm remote numbers before a move. `/global/project/snapshot/remotenumber/?` asks for the snapshot list. `/source/*/dump` asks for source parameters on the OSC outputs. The log shows what SPAT emitted.
3. Move source remote number 1 in polar with `/source/1/aed` and three floats in the table's order: azimuth, elevation, distance. Azimuth stays between -180 and 180 degrees, elevation between -90 and 90, and distance between 0.01 and 100 meters. Leave `/source/1/xyz` unused on a source you are moving in polar.
4. Set gain with `/source/1/gain` and a float from -144.5 to 24. The mute row uses 0 for muted and 1 for unmuted. On a 25.01 or later build, `/source/1/relative/gain 1.0` adds 1.0 dB.
5. Recall snapshot remote number 2 with `/snapshot/2/recall`. The commentary says a time argument is optional and defaults to 0 seconds. `/snapshot/next/recall` is the table's example for the next snapshot. Leave create, remove, and removeall out of the show client.

Source: [OSC Control and Commands](https://www.flux.audio/knowledge-base/osc-control-and-commands/), the [OSC guidelines spreadsheet](https://d3imvdzbwv9jtx.cloudfront.net/PRODUCTS%20TEMPLATES/OSC/Spat%20Revolution%20OSC%20Guidelines%20and%20Table%20Public%20Version.xlsx) linked there, and [SPAT Revolution OSC connections](https://doc.flux.audio/spat-revolution/Ecosystem_&_integration_OSC_Connections_Matrix.html).

## FAQ

### Is AED azimuth, distance, elevation?
The spreadsheet's AED description says the three floats are azimuth, then elevation, then distance. The connections chapter names those coordinates and says not to automate Cartesian and polar together.

### Does mute 1 mean muted?
The mute row says 0 is muted and 1 is unmuted. The range cells are 0 and 1, and the default cell is 0.

### What recalls a snapshot with no crossfade?
`/snapshot/2/recall` addresses snapshot remote number 2. The recall commentary says the time argument defaults to 0 seconds. `/snapshot/next/recall` is the form the table gives for the next snapshot.
