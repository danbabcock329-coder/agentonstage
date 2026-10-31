---
title: "Take Ross XPression items over RossTalk"
slug: take-ross-xpression-items-over-rosstalk
category: "LED/Video"
tools: ["Ross XPression", "RossTalk"]
difficulty: Intermediate
source_url: https://help.rossvideo.com/carbonite-device/Topics/Protocol/RossTalk/XPN/RT-XPN-Comm.html
labels: ["Commercial product"]
summary: "XPression accepts RossTalk on TCP port 7788, each command ended by CR/LF. TAKE 5:0:7 loads take item 5 into framebuffer 1 on layer 7. RossTalk framebuffer 0 is XPression framebuffer 1."
---

## What it does

Ross Video's XPression Commands page says the motion graphics system accepts RossTalk over Ethernet on port 7788. Each command ends with a carriage return and a line feed. All commands are case sensitive. The setup on that page is inside XPression: Edit, Hardware Setup, GPI Boards, Add, Brand set to RossTalk, State set to Enabled, transport set to TCP, and the TCP port set to 7788.

The same page says the framebuffer number in RossTalk does not match the number in XPression. Framebuffer 1 in XPression is framebuffer 0 in RossTalk. Framebuffer 2 is 1, and so on.

`TAKE takeid:buffer:layer` loads that take item to air in that framebuffer and layer. The sequencer focus does not move. The page's example `TAKE 5:0:7` loads the template with TakeID 5 into framebuffer 1 and onto layer 7. `SEQI takeid:layer` loads the take item to air on that layer, on the output channel selected in the template, and the sequencer focus moves to the item. The example `SEQI 0005:7` loads take item 0005 onto layer 7. `SEQO takeid` takes that take item off air. The example `SEQO 0005` takes the template with TakeID 5 off air.

`CUE takeid:buffer:layer` prepares the take item and does not take it to air. The page says the point of that command is a take with no frame delay. `LAYEROFF buffer:layer` takes the scene on that layer off air with the defined out transition. `LAYEROFF 0000:2` removes the scene on layer 2 of the first framebuffer. `CLFB buffer` clears a framebuffer. `CLFB 0000` clears framebuffer 1. `CLFB buffer:layer` clears one layer. `CLRA` clears all framebuffers.

`FOCUS takeid` moves the sequencer focus and does not, by the page's wording, take the item. `FOCUS 0005` focuses take item 0005. `UP` and `DOWN` move the selection. `NEXT` takes the current take item and advances the selection. `READ` takes the current selection to air. `RESUME 0000` resumes all layers in framebuffer 1. `RESUME 0000:2` resumes layer 2 there. `SWAP 0` takes every cued item in framebuffer 1 to air. `UNCUE takeid` and `UNCUEALL` leave the cued state. `GPI 5` fires simulated GPI input 5.

## How to set it up

1. In XPression, open Edit, Hardware Setup, GPI Boards. Add a board, set Brand to RossTalk, set State to Enabled, choose TCP, and set the TCP port to 7788.
2. From the show machine, open a TCP connection to the XPression computer on that port. End every command with CR/LF. Keep the command text in the case the page prints.
3. Read the TakeID off the sequencer item you mean to run. Send `FOCUS 0005`, using that item's id, and confirm the focus moved before anything is taken.
4. Send `TAKE 5:0:7` only when take item 5 should land in XPression framebuffer 1 on layer 7. Remember that RossTalk buffer 0 is XPression framebuffer 1. Use `SEQI 0005:7` when the focus should follow the item. Use `SEQO 0005` to take that item off air.
5. Use `LAYEROFF 0000:2` when one layer should run its out transition. Leave `CLRA` out of a show client. The page says `CLRA` clears all framebuffers. `CUE` is the prepare step when the next take has to happen without a frame delay.

Source: [XPression RossTalk commands](https://help.rossvideo.com/carbonite-device/Topics/Protocol/RossTalk/XPN/RT-XPN-Comm.html)

## FAQ

### Why is the framebuffer number one lower?
The XPression commands page says RossTalk framebuffer numbering does not match XPression. Framebuffer 1 in XPression is entered as 0. The `TAKE 5:0:7` example loads into framebuffer 1.

### Does TAKE move the sequencer?
The page says `TAKE` loads the item and the sequencer focus does not move. `SEQI` loads the item and moves the focus. `NEXT` takes the current item and advances the selection. `READ` takes the current selection.

### Are the commands case sensitive?
The page says all commands are case sensitive, and that each command is terminated by a carriage return and a line feed. The enable steps set the TCP port to 7788.
