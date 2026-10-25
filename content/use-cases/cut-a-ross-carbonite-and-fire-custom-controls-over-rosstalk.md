---
title: "Cut a Ross Carbonite and fire custom controls over RossTalk"
slug: cut-a-ross-carbonite-and-fire-custom-controls-over-rosstalk
category: "LED/Video"
tools: ["Ross Carbonite", "RossTalk"]
difficulty: Intermediate
source_url: https://documentation.rossvideo.com/files/Manuals/Protocol%20Documents/RossTalk-Commands%284802DR-403%29.pdf
summary: "Ross Carbonite takes RossTalk ASCII on Ethernet port 7788, with each command ended by CR/LF. CC 1:05 fires custom control 5 on bank 1, and MECUT ME:1 cuts ME 1."
---

## What it does

Ross Video's RossTalk command document, part 4802DR-403-35, dated June 2026, describes a plain-text protocol for Carbonite and Graphite. Carbonite accepts it over Ethernet on port 7788. The document says Carbonite does that without an extra enable step. Graphite needs RossTalk set to On under Navigation Menu, Configuration, System. The default switcher address in the send steps is 192.168.0.123. Each command ends with a carriage return and a line feed. Commands are case sensitive. The send steps say to use telnet or any other application that can send ASCII.

`CC 1:05` runs custom control 5 on bank 1. `MECUT ME:1` cuts ME 1. `MEAUTO MSC:2` runs an auto transition on MultiScreen channel 2. The elements included in a cut or auto transition are whatever the next-transition area already has selected. `FTB` fades to black. `XPT ME:2:PGM:IN:6` selects input 6 on the program bus of ME 2. `XPT AUX:2:ME:1:CLN` selects the ME 1 clean feed on aux 2. `GPI 04` fires the action assigned to GPI input 4, and does nothing if that GPI is an output. `HELP` prints the supported commands.

A question mark in place of the selection reads state back, and only for XPT, MS, MNEM, TRANSRATE, TRANSTYPE, TRANSINCL, MVBOX, and KEYSHAPED. The document's example is `MVBOX 2:6:?`, which returns the source in box 6 of MultiViewer channel 2.

ME numbers are not the same on every Carbonite. The document says Carbonite, Carbonite eXtreme, Carbonite Black, Carbonite Solo, Mosaic, and UltraChromeHR number MEs as ME 1, ME 2, and ME 3, with the highest number as the program ME. Carbonite Ultra numbers them ME 2, ME 1, and ME P/P, with ME P/P as the program ME. Its example is `KEYAUTO ME:3:4` for an auto transition of key 4 on ME 3 of a Carbonite Black, and `KEYAUTO ME:P/P:4` for the same action on Ultra.

The same PDF documents XPression as a separate RossTalk device, also on port 7788, with its own command list. An XPression command such as `TAKE` is not a Carbonite command.

## How to set it up

1. On Carbonite, open a connection to port 7788. The document's default address is 192.168.0.123. On Graphite, turn RossTalk on under Navigation Menu, Configuration, System before you connect.
2. End every command with CR/LF. Keep the command text in the case the table uses.
3. Fire a custom control with `CC 1:05` for custom control 5 on bank 1. Cut with `MECUT ME:1`. Fade to black with `FTB`.
4. Put a source on program with `XPT ME:2:PGM:IN:6` for input 6 on ME 2 program. Read a MultiViewer box with `MVBOX 2:6:?`.
5. On Carbonite Ultra, address the program ME as ME P/P. The document's Ultra key example is `KEYAUTO ME:P/P:4`.

Source: [RossTalk commands, 4802DR-403-35](https://documentation.rossvideo.com/files/Manuals/Protocol%20Documents/RossTalk-Commands%284802DR-403%29.pdf).

## FAQ

### Does Carbonite need RossTalk switched on?
The document says Carbonite accepts RossTalk on port 7788 on its own. Graphite needs RossTalk set to On under Navigation Menu, Configuration, System.

### Are XPression commands the same list?
The same PDF gives XPression its own table, also on port 7788. `TAKE 5:0:7` loads take item 5 into framebuffer 1 on layer 7, because XPression framebuffer 1 is RossTalk framebuffer 0. That table is not the Carbonite table.
