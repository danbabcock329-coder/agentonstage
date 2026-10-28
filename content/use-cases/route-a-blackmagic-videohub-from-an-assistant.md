---
title: "Route a Blackmagic Videohub from an assistant"
slug: route-a-blackmagic-videohub-from-an-assistant
category: "LED/Video"
tools: ["Blackmagic Videohub", "TCP"]
difficulty: Intermediate
source_url: https://documents.blackmagicdesign.com/DeveloperManuals/VideohubEthernetProtocol.pdf
labels: ["Commercial product"]
summary: "Videohub Ethernet Protocol v2.3 is text on TCP port 9990. A client reads the status dump, sends a routing block, and trusts the status update that comes back."
---

## What it does

Blackmagic's Videohub Ethernet Protocol, dated November 2023 on the developer note, is version 2.3 and was released with Videohub 4.9.1 software. The cover list is Videohub 12G, Universal Videohub, Smart Videohub, CleanSwitch 12x12, Videohub Master Control Pro, Videohub Smart Control Pro, and the Blackmagic GPI and Tally Interface. The server listens on TCP port 9990. Integrated Videohub Servers and Videohub Server computers are both in scope.

The protocol is blocks of text. A header is all-caps and ends with a colon. Lines end with a newline. A blank line ends the block. On connect, the server dumps its state. After that it sends a status block whenever a route, label, or lock changes. A client should ignore a block it does not recognize, up to the blank line, and ignore lines it does not recognize inside a block it does know.

The first block is `PROTOCOL PREAMBLE:` with `Version:`. The next is `VIDEOHUB DEVICE:`. The note's Smart Videohub example reports `Device present: true`, the model name, and counts for video inputs, video outputs, video processing units, video monitoring outputs, and serial ports. `Device present: false` means no device is attached. Incompatible firmware is reported on that same field as a needs-update value. The PDF text extraction of that token has spaces around the underscore. In either of those two cases the note says no further information is sent until the situation changes.

Labels, routing, and locks follow. The note says port numbers in the protocol start at zero, and zero matches port one on the chassis. A routing line is the output index, a space, and the input index. The worked example for changing output port 8 to input port 3 is therefore:

```
VIDEO OUTPUT ROUTING:
7 2

```

That block has to end with a blank line. The server answers `ACK` or `NAK`, each followed by a blank line. After `ACK`, expect a status update. The note says that update is often the same block you sent, but another client can change the router at the same time, and the update is then different. A client must treat the status blocks as the router state, not the command it just sent.

Lock lines use `O` when this client owns the lock, `L` when another client holds it, and `U` when the port is unlocked. Forcing a lock that someone else holds uses `F` instead of `U`. The note's force example on serial port 7 is answered with a status line of `7 U`. Hardware status blocks (`VIDEO INPUT STATUS` and the matching output and serial blocks) are server-only. The note says a client that sends them is ignored. Those blocks are described for Universal Videohubs with pluggable cards. Processing-unit and frame-buffer blocks are described for the Workgroup Videohub only.

Sending a header and a blank line, with no body, asks for a full dump of that block. `PING:` followed by a blank line is the no-operation check. A responding server answers `ACK`.

## How to set it up

1. Open TCP to the Videohub Server on port 9990. Read through the blank line after `VIDEOHUB DEVICE:`. Stop if `Device present` is anything other than `true`.
2. Read `INPUT LABELS:`, `OUTPUT LABELS:`, and `VIDEO OUTPUT ROUTING:`. Remember that protocol index 0 is chassis port 1. Ask for a fresh dump by sending the header and a blank line before you cache it.
3. To take one crosspoint, send `VIDEO OUTPUT ROUTING:`, one line of `outputIndex inputIndex`, and a blank line. Use the note's own example, `7 2`, only when you mean chassis output 8 from chassis input 3.
4. Wait for `ACK` or `NAK`. Update your local routes only from the status block that follows. If another client routes at the same time, the note says the two updates can cancel.
5. Leave `F` force-unlock, label edits, and serial-port routing out of an unattended session. Send `PING:` when you only need to know the server is still answering.

Source: [Videohub Ethernet Protocol, November 2023 (v2.3)](https://documents.blackmagicdesign.com/DeveloperManuals/VideohubEthernetProtocol.pdf). The [developer downloads page](https://www.blackmagicdesign.com/developer/products/videohub/sdk-and-software) lists that manual as released 01 Nov 2023.

## FAQ

### Is port 9990 the HyperDeck port?
No. This note puts the Videohub server on TCP 9990. Blackmagic's HyperDeck Ethernet Protocol, December 2024, puts HyperDeck recorders on TCP 9993.

### Does ACK mean the route is now taken?
The note says ACK means the request was understood. The status update after it is the route. NAK means the request was not understood. Watch the status block either way.

### What does a lock of L mean?
`L` means a different client owns the lock. `O` means this client owns it. `U` means unlocked. `F` is the override that clears someone else's lock, and the status that comes back in the note's example is `U`.
