---
title: "Set Ultimatte 12 matte density over Ethernet"
slug: set-ultimatte-12-matte-density-over-ethernet
category: "LED/Video"
tools: ["Blackmagic Ultimatte 12", "TCP"]
difficulty: Intermediate
source_url: https://documents.blackmagicdesign.com/DeveloperManuals/UltimatteEthernetProtocol.pdf
labels: ["Commercial product"]
summary: "Ultimatte 12 takes text blocks on TCP 9998. A blank line ends the block. ACK accepts it. The controls table runs Matte Density from 0 to 10000."
---

## What it does

Blackmagic's Ultimatte Ethernet Protocol, September 2022, version 2.0, is the text protocol for an Ultimatte 12. The overview says a client connects to TCP port 9998. The Telnet walkthrough uses `telnet 192.168.10.220 9998` and then waits for a status list. The same walkthrough sends `control:`, then `backing color: blue`, and a second Enter. It says the terminal answers `ack`. `factory defaults: yes`, sent the same way, restores factory settings and performs an automatic composite. `matte density: 273` is the walkthrough's density example.

The protocol section describes the same session as blocks. A block header is capitals followed by a colon. Each line ends with a newline. A blank line ends the block. The first block is `PROTOCOL PREAMBLE:` with `Version: 2.0`. The identity example prints `Model: Ultimatte 12 8K`. A note says some models have fewer inputs. The Ultimatte 12 HD Mini list is foreground and background. The Ultimatte 12 HD list adds garbage matte, holdout matte, monitor, and reference.

A change uses the same block shape the unit sends. The printed density change is:

```
CONTROL:
Matte Density: 100

```

The blank line is required. The unit answers `ACK` or `NAK`, each as its own block. After `ACK`, a status block follows. The page says that block can differ from the request when the change could not be performed or when another client changed something at the same time. It says a client should update its copy of the state from those status blocks. A relative change, for numeric controls only, is `Offset Matte Density: 10`. Sending a header and a blank line asks for that whole block again.

The controls table lists `Matte Density` as 0 to 10000. `Backing Color` is `Red/Green/Blue`. `Factory Defaults` is `Yes`. The Telnet walkthrough prints those three fields in lowercase. This page does not say the two spellings are aliases.

`FILE:` with `Load:`, `Save:`, `Delete:`, or `Rename:` plus `To:` is the file block. `FRAME BUFFER:` can assign an image that is already in the media pool. The note says the Telnet interface does not load or remove media-pool images. That is done from a Smart Remote 4 or the Software Control application. `GPI:` is absent on the Ultimatte 12 HD Mini. `CAMERACONTROL:` is only on that Mini.

## How to set it up

1. Connect to TCP port 9998. The walkthrough's example address is `192.168.10.220`. Read until `END PRELUDE:`. The preamble's `Version` field in the printed block is `2.0`.
2. Read `IDENTITY:` and `DEVICE:` before a change. Match the model to the input note. A Mini status block will not contain the inputs the 8K example lists.
3. Send a `CONTROL:` block, one field per line, and a blank line. For the table's density field the name is `Matte Density` and the range is 0 to 10000. Wait for `ACK` or `NAK`, then for the status block. Keep the value from that status block.
4. Ask for a fresh copy by sending the header and a blank line, as in `CONTROL:` followed by a blank line. Use `Offset` only on a numeric control. The page's example is `Offset Matte Density`.
5. Leave `Factory Defaults` and the Telnet line `factory defaults: yes` off an unattended client. The walkthrough says that line restores factory settings and runs an automatic composite.

Source: [Ultimatte Ethernet Protocol, September 2022, version 2.0](https://documents.blackmagicdesign.com/DeveloperManuals/UltimatteEthernetProtocol.pdf).

## FAQ

### Does the page print a password?
The Telnet steps go from the port to `control:` with no login line. The protocol section does not add an authentication field. `ACK` and `NAK` are the two replies it prints for a finished block.

### Why does one example say 273 and another say 100?
The Telnet walkthrough sends `matte density: 273`. The protocol example sends `Matte Density: 100`. The controls table gives that field the range 0 to 10000. The page does not say the lowercase Telnet line and the `CONTROL:` line are the same parser.

### Can the client upload a still over this port?
The frame-buffer note says the Telnet interface does not load or remove media-pool images. `FRAME BUFFER:` assigns an image that is already stored. Loading is left to Smart Remote 4 or the Software Control application.
