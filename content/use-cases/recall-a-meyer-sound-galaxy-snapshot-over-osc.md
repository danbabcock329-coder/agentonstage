---
title: "Recall a Meyer Sound GALAXY snapshot over OSC"
slug: recall-a-meyer-sound-galaxy-snapshot-over-osc
category: "Audio"
tools: ["Meyer Sound GALAXY", "OSC", "ASCII"]
difficulty: Intermediate
source_url: https://docs.meyersound.com/products/en/programming-guide---galileo-galaxy.html
labels: ["Commercial product"]
summary: "A physical GALAXY listens for OSC on port 25004 and ASCII on port 25003. :recall_snapshot 3 recalls snapshot 3; the OSC form is /recall_snapshot,i 3."
---

## What it does

Meyer Sound's Galileo GALAXY programming guide describes the Control Plane server. The guide uses GALAXY for the GALAXY 408, the GALAXY 816, the legacy GALAXY 816-AES, and the Bluehorn 816. Compass and other clients can be connected at the same time. The processor has two modes: Normal Mode, for loudspeaker management with Compass or Compass Go, and Spacemap Mode, for spatial mixing with Spacemap Go. The port numbers for a virtual processor depend on that mode.

A physical processor listens for OSC on port 25004 and for ASCII on port 25003. The port-address table lists physical devices 1, 2, and 3 as OSC 25004, 25104, 25204 and ASCII 25003, 25103, 25203, in both modes. A virtual processor in Normal Mode starts at OSC 50504 and ASCII 50503, and each further virtual processor is 100 lower (the guide's examples are 50404 and 50304). In Spacemap Mode a virtual processor starts at OSC 25004, and each further one is 100 higher (25104, then 25204). The same page spells one sentence "virtual GALAXY procesor". The note under the table says to check the Log tab in Compass for the port of a given device.

ASCII built-in commands start with `:`. Every ASCII command ends with a newline, which the guide defines as carriage return `0d` or line feed `0a`. `:recall_snapshot 3` recalls snapshot 3. The OSC form is `/recall_snapshot,i 3` with one integer. The TCP OSC cell for that recall begins with the four bytes `00 00 00 1c` and then the message. The UDP OSC cell begins with the address and has no length prefix. A second integer turns on exclusions. The guide says 9 excludes mute information, because 1 enables exclusion and 8 is the mute code. That recall is `:recall_snapshot 3 9`, or `/recall_snapshot,i 3 9`.

A control point is an address. The query example `/processing/input/1/mute` returns `/processing/input/1/mute='false'` when input 1 is unmuted. The single-input set is ASCII `/processing/input/1/mute=true`, and its hex ends in `0a`, with no quotation marks around `true`. The OSC cell on that row is `/processing/input/1/mute, T`. The UDP bytes end in `2c 54 00 00`, the type tag for OSC true. The page says GALAXY type-casts an integer to Boolean, and that Boolean true is any positive non-zero integer. The regular-expression example that mutes every single-digit input is printed as `/processing/input/\d/mute=` plus a curly apostrophe, `true`, and a curly apostrophe. The lines it says come back use straight single quotes, `/processing/input/1/mute='true'` through input 8.

Built-in commands other than ping act on snapshots, and they assume the snapshot exists, except `create_snapshot`. A UDP subscription ends when the server has received no UDP from that client for at least 30 seconds. The keepalive the guide names is an empty ping OSC message. The ping section heading says to send ping with no argument, and the example on that row is `:ping Hello World`, OSC `/ping,s Hello World`, answered by `:pong Hello World`. The guide says you cannot send pong.

## How to set it up

1. Read the Compass Log tab for the port before you send. A physical unit 1 is OSC 25004 or ASCII 25003. A second physical unit is 100 higher. A virtual processor in Normal Mode starts at 50504 or 50503 and counts down by 100. Spacemap Mode virtual processors start at 25004 and count up.
2. On ASCII, end the line with CR or LF. Recall a snapshot that already exists with `:recall_snapshot 3`. The OSC recall is `/recall_snapshot,i 3`. `:recall_snapshot 3 9` is the guide's recall that excludes mute information.
3. Query input 1 with `/processing/input/1/mute` and read the quoted `true` or `false` that comes back. Mute that input in OSC with `/processing/input/1/mute, T`. The ASCII set on the same row is `/processing/input/1/mute=true` and the hex has no quote characters.
4. Keep a UDP subscription up by sending the empty ping the keepalive paragraph describes when the processor is quiet. The worked ping example that expects a pong is `:ping Hello World`.
5. Treat the curly apostrophes in the regular-expression mute example as characters printed on the page, not as the quotes in the reply. The reply lines use straight single quotes.

Source: [Galileo GALAXY programming guide](https://docs.meyersound.com/products/en/programming-guide---galileo-galaxy.html). [Place Meyer Sound Spacemap Go channels over OSC](/use-cases/place-meyer-sound-spacemap-go-channels-over-osc) is the separate general-purpose map on UDP 38033. This page is the Control Plane on 25003 and 25004.

## FAQ

### Is port 38033 this protocol?
No. The Spacemap Go user guide receives general-purpose OSC on UDP 38033. This programming guide's physical OSC port is 25004, and its ASCII port is 25003. Spacemap Mode changes the virtual-processor numbering on this page. It does not replace those Control Plane ports with 38033.

### Why does one mute example use curly apostrophes?
The regular-expression set is published with U+2019 apostrophes around `true`. The single-input ASCII set `/processing/input/1/mute=true` and its hex do not include a quote byte. The query replies use a straight single quote, as in `mute='false'`.

### What does the second number on recall mean?
`:recall_snapshot 3 9` is snapshot 3 with exclusion value 9. The guide says 1 enables exclusion and 8 is the code that excludes mute information. A recall with only the snapshot integer, `:recall_snapshot 3`, has no exclusion argument.
