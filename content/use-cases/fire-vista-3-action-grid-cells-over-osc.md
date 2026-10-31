---
title: "Fire Vista 3 action-grid cells over OSC"
slug: fire-vista-3-action-grid-cells-over-osc
category: "Lighting"
tools: ["Vista", "OSC"]
difficulty: Intermediate
source_url: https://www.sceneteknikk.no/wp-content/uploads/Vista-by-Chroma-Q-Vista-3-R5.0-Release-Notes.pdf
labels: ["Commercial product"]
summary: "Vista 3 R5.0, build 1715, listens for OSC on the port you set under File > Preferences. /V3/actionGrid/1/button/row/1/col/2 with 1 presses that cell, and the same address with 0 releases it."
---

## What it does

The Vista 3 R5.0 release notes, marked official release, build 1715, dated 2 March 2026, add an OSC tab under File, Preferences. Enable OSC there and define the receive port. The notes do not publish a fixed port number. To send OSC back to the controller, add an OSC client and fill in its details. Virtual EX faders and buttons can be mapped to OSC, and show components can be assigned to those playbacks in the usual way.

Action-grid cells are addressed by row and column. The notes' example for the cell they label column row 1, cell 2, is `/V3/actionGrid/1/button/row/1/col/2` with argument `1` for the on state and the same address with argument `0` for the off state. A column header uses row 0, as in `/V3/actionGrid/1/button/row/0/col/1` with `1` and then `0`. The sentence under that table says the value after `actiongrid/` is the ID of the Actiongrid. The paths themselves spell it `actionGrid`.

Feature levels are a separate set of addresses. `/V3/feature/intensity/intensity` is listed with `0` for 0 percent, `0.5` for 50 percent, and `1.0` for 100 percent. `/V3/feature/intensity/intRel` is listed with `-0.05` and `0.05`. `/V3/feature/intensity/release`, `/V3/feature/intensity/home`, and `/V3/feature/intensity/clear` are listed with argument `1`.

Virtual-console playback addresses start with `/V3/console/EX/`. The notes say the number after `EX/` is the ID of the virtual console, based on the order the virtual EXs were added to the showfile. A second EX uses `/V3/console/EX/2/...`. One clean pair in the table is `/V3/console/EX/1/pageUp/panel/0/bank/1` with `1` for on and `0` for off. `/V3/console/EX/1/spbPlay` uses `1` and `0` the same way. Several playback-button rows in the PDF wrap in the middle of `bank/`, so those lines are a poor thing to retype. Help, External I/O Reference, on the main toolbar, opens a window that copies example OSC messages for the components in the open showfile.

## How to set it up

1. In Vista 3 R5.0, open File, Preferences, OSC. Enable OSC and set the receive port. Point the OSC sender at the Vista computer and that port. Add an OSC client on the same tab only if Vista should send status back.
2. Open Help, External I/O Reference, and copy the action-grid address for the cell you intend to fire. Check the number after `actionGrid/` against the Actiongrid ID in the show.
3. Send `/V3/actionGrid/1/button/row/1/col/2` with argument `1` only when that copied path matches the cell. The release notes list this as the on state for the cell at row 1, column 2 of Actiongrid 1.
4. Send the same address with argument `0` to release it. The table gives every action-grid example as an on value and an off value. Copy page and playback addresses from External I/O Reference when the printed playback-button line is split.
5. Leave `/V3/feature/intensity/intensity` at `1.0` off the first test. The notes list `0`, `0.5`, and `1.0` for that address, and they list `/V3/feature/intensity/release` with argument `1` when intensity should be released. The number after `EX/` follows the order the virtual EXs were added, so confirm it in External I/O Reference before a playback message.

Source: [Vista 3 R5.0 release notes](https://www.sceneteknikk.no/wp-content/uploads/Vista-by-Chroma-Q-Vista-3-R5.0-Release-Notes.pdf) (official release, build 1715, 2 March 2026).

## FAQ

### Is the OSC port fixed?
The release notes say to enable OSC and define the receive port number. They do not print a default port. The sender has to use the port set on that tab.

### What is the number in /V3/actionGrid/1/?
The notes say the value after `actiongrid/` is the ID of the Actiongrid. The example paths spell the segment `actionGrid`. A second virtual EX is a different number: the notes say it becomes `/V3/console/EX/2/...`.

### Where should a show-specific path come from?
Help, External I/O Reference, copies example messages for the components in the open showfile. That is the path to use when a playback-button line in the PDF is split across `bank/`.
