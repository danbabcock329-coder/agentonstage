---
title: "Recall an SRG-A40 preset over VISCA IP"
slug: recall-an-srg-a40-preset-over-visca-ip
category: "LED/Video"
tools: ["Sony SRG-A40", "VISCA"]
difficulty: Intermediate
source_url: https://www.sony.com/electronics/support/res/manuals/5053/f48354480e724f0aef3d45d2e1eeab63/50531551M.pdf
labels: ["Commercial product"]
summary: "Sony's SRG-A40 VISCA-over-IP spec uses UDP port 52381. Preset recall is 81 01 04 3F 02 pp FF, and pp is the preset number minus 1, from 00 to 63."
---

## What it does

Sony document 5-053-155-16 (1), VISCA Command List and CGI Command List, software version 4.0, is the command list for the SRG-A40 and SRG-A12. The overview says it covers VISCA, CGI, and RTSP for those two cameras. The VISCA-over-IP chapter is UDP on IPv4, port 52381, over the RJ-45 port. Up to five controllers can be connected at once. The document says UDP does not guarantee delivery, so the controller has to time out and retransmit. It also says control software built from this list can malfunction or damage hardware or software, and that Sony is not liable for that damage.

A VISCA-over-IP message is an 8-byte header plus a payload of 1 to 16 bytes. The header fields are payload type, payload length, and sequence number. A VISCA command uses payload type bytes `0x01` `0x00`. The length example stores a 16-byte payload as byte 2 `0x00` and byte 3 `0x10`. The controller puts a new sequence number on each message. When the sequence number hits its limit, the next value is 0. The camera copies that sequence number onto the reply. A control command of RESET, payload `0x01`, sets the sequence number back to 0.

The camera address inside the VISCA payload is locked to 1, and the controller address is locked to 0. The command list still prints the address as `8x`. With the lock, a command starts with `81`. The limitation section says a payload whose camera address is not 1 still runs, because the camera treats its own address as 1. A controller address other than 0 still runs, and the reply address from the camera is always 0.

Preset recall is in the command table:

`81 01 04 3F 02 pp FF`

`pp` is the preset number minus 1, from `00` to `63`. Preset 1 is `pp` of `00`, so the payload is `81 01 04 3F 02 00 FF`. That payload is 7 bytes, inside the 1-to-16 range. Set is `81 01 04 3F 01 pp FF`. Reset is `81 01 04 3F 00 pp FF`. Separate preset speed is `81 01 7E 01 0B pp qq FF`, and `qq` is `01` to `19`.

A command returns ACK and then a completion notice, and those completions can come back out of order if more than one command is in flight. The camera has two command buffers. The timing section says that sending further commands without waiting raises the chance of a drop or a buffer error, because several controllers can be talking at once. On a timeout, the delivery table says to retransmit with the same sequence number. Do not send Address Set, and do not use the VISCA broadcast address. The document says both belong to the serial link and are not guaranteed on IP. The tally lamp turns off if no controller sends another tally ON within 15 seconds of the last one.

## How to set it up

1. Put the controller on the camera LAN. Send UDP to the camera on port 52381. The spec allows up to five controllers on that port. This write-up is document 5-053-155-16 (1) for the SRG-A40 and SRG-A12.
2. Build the 8-byte header. Payload type for a VISCA command is `0x01` `0x00`. Set the length bytes the way the 16-byte example does: a 7-byte recall uses length bytes `0x00` `0x07`. Put a sequence number in the rest of the header and increase it on the next new message.
3. Recall preset 1 with payload `81 01 04 3F 02 00 FF`. The table's `pp` is the preset number minus 1, so preset 1 is `00` and the highest value in that comment is `63`.
4. Wait for the reply before the next move. The spec says the camera holds two commands. If the reply does not arrive, retransmit that same sequence number. A RESET control command, payload `0x01`, is how the sequence number is set back to 0.
5. Leave Address Set and the VISCA broadcast address unused. The limitation section says those are not guaranteed on VISCA over IP.

Source: [SRG-A40/A12 VISCA and CGI command list, 5-053-155-16 (1)](https://www.sony.com/electronics/support/res/manuals/5053/f48354480e724f0aef3d45d2e1eeab63/50531551M.pdf).

## FAQ

### Is this the BRC CGI preset call?
[Recall Sony BRC and SRG presets over CGI](/use-cases/recall-sony-brc-and-srg-presets-over-cgi) is HTTP Digest for a different command list and a different set of cameras, including the BRC-X400 and SRG-X400. This page is UDP 52381 for the SRG-A40 and SRG-A12. The same PDF has a CGI chapter for these two models. The commands above are the VISCA-over-IP chapter.

### Is this the PTZOptics VISCA port?
[Recall PTZOptics camera presets over HTTP](/use-cases/recall-ptzoptics-camera-presets-over-http) says that brand's network VISCA is commonly TCP 5678 or UDP 1259. The port in this Sony spec is UDP 52381, and the VISCA bytes sit in a payload after the 8-byte header.

### What does pp of 00 recall?
The command comment says `pp` is the preset number minus 1, from `00` to `63`. Preset 1 is `00` in `81 01 04 3F 02 00 FF`. The camera address in that first byte stays `81` on VISCA over IP, because the peripheral address is locked to 1.
