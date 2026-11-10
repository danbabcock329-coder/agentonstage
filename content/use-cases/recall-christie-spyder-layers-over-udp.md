---
title: "Recall Christie Spyder layers over UDP"
slug: recall-christie-spyder-layers-over-udp
category: "LED/Video"
tools: ["Christie Spyder X80", "UDP"]
difficulty: Intermediate
source_url: https://www.christiedigital.com/globalassets/resources/public/020-102207-08-christie-lit-man-ref-spyder-commands.pdf
labels: ["Commercial product"]
summary: "Spyder X80 takes UDP on port 11116. Each packet starts with the 10-byte spyder header. FKR 3002 recalls function key 2 on page 3."
---

## What it does

Christie's X80 Serial Commands Reference, document 020-102207-08 Rev. 1 (10-2020), is the external-control command list for a Spyder frame. Ethernet and the 9-pin RS232 port answer the same string commands, and the manual says both interfaces can do so at the same time. Over Ethernet, send each command in a UDP packet to port 11116 on the frame. The manual says no configuration is required for that port.

Every UDP message starts with a 10-byte header. Bytes 0 through 5 are the characters `s`, `p`, `y`, `d`, `e`, `r`. Bytes 6 through 9 are `0x00`. Do not put a space between that header and the command. On serial, the manual says to terminate each command with a carriage return. Spaces inside a string argument are written as the three characters `%20`, because a space is the argument delimiter.

The first value in every response is a result code. `0` is Success. `1` is Empty, meaning the requested data is not available. `2` is Header, an invalid command. `3` is Argument count. `4` is Argument value. `5` is Execution, and the manual says to check the Alert Viewer in Spyder Studio for the detail. `6` is Checksum and is marked reserved.

Layer IDs start at 2. The manual says layer IDs 0 and 1 are reserved for future commands that use the two background layers. `RLC` returns the logical layer count, and that count includes those two background layers. The same section says most applications should subtract two from the response. `RLS` plus a layer ID returns the source name and source register on that layer. An empty result with no parameters means no source is assigned. If a source is assigned but no register can be found, the register ID in the response is 1.

`FKR` recalls one function key. To reach a register above the first page, add the page number times 1000 to the register ID. The manual's example is register ID 2 on page 3, which is sent as register ID 3002. An optional ID-type argument uses `F` for the function-key ID, which is the default, or `R` for a register ID. `TRN` mixes layers on or off their current pixelspace: `0` is mix off and `1` is mix on, followed by a duration and the layer IDs. `SRA` applies a source that already exists. The manual defines a source as an input configuration plus a router input, and says to create those in Spyder Studio.

`SDN` is the remote power command. `0` powers the server application off and `1` restarts it. That command does not belong in a cue client. `SWA` swaps two layers, and the note says both layers must be visible on screen or the response is ArgValue.

## How to set it up

1. Address the Spyder frame on UDP port 11116. Put the 10-byte header on the front of the datagram and start the command text on the next byte, with no space. Use a carriage return only on the serial port, where the manual requires one.
2. Send `RLC` and subtract 2 from the returned count before you pick a layer. The manual says layer IDs 0 and 1 are the reserved background IDs, so the first content layer ID is 2.
3. Send `RLS` with one layer ID and read the result code. Code `1` with no parameters means that layer has no source. Code `0` is the success row in the response table.
4. Recall the manual's function-key example with `FKR 3002`. That is register ID 2 on page 3, because the page is multiplied by 1000 and added to the register. Mix those layers with `TRN`, using `1` to mix on and `0` to mix off, then the duration and the layer IDs.
5. Leave `SDN` out of the client. `0` powers the server off and `1` restarts it. Build sources in Spyder Studio before an `SRA`, because the command only applies a source that already exists.

Source: [Spyder X80 Serial Commands Reference, 020-102207-08 Rev. 1 (10-2020)](https://www.christiedigital.com/globalassets/resources/public/020-102207-08-christie-lit-man-ref-spyder-commands.pdf).

## FAQ

### Do layer numbers start at 1?
The command considerations say layer IDs start at 2. IDs 0 and 1 are reserved for the two background layers. `RLC` includes those two backgrounds in the count, and the manual says most applications should subtract two.

### What does result code 1 mean?
The response table names `1` Empty: the data requested is not available. On `RLS`, an empty result with no parameters means no source is assigned to that layer. `0` is Success.

### How is a function key on page 3 addressed?
Add the page number times 1000 to the register ID. The manual's worked example is function key register ID 2 on page 3, sent as register ID 3002.
