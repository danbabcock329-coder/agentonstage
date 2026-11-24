---
title: "Start a Blackmagic Streaming Encoder over Ethernet"
slug: start-a-blackmagic-streaming-encoder-over-ethernet
category: "LED/Video"
tools: ["Blackmagic Streaming Encoder", "TCP"]
difficulty: Intermediate
source_url: https://documents.blackmagicdesign.com/DeveloperManuals/WebPresenterEthernetProtocol.pdf
labels: ["Commercial product"]
summary: "The January 2026 Streaming Encoder note uses TCP 9977. STREAM STATE with Action Start gets ACK, then Status Connecting. Stop returns Status Idle."
---

## What it does

Blackmagic's Streaming Encoder Ethernet Protocol, dated January 2026 and marked protocol version 1.2, is the text protocol for the Blackmagic Streaming Encoder HD and the Blackmagic Streaming Encoder 4K. The file name on the download URL still says WebPresenter. The note itself titles the products as Streaming Encoders. A client connects to TCP port 9977. The server ends lines with LF. The client may end lines with LF or CR LF. Each message is a block: a header, a colon, then key/value lines, then a blank line. The first full colon on a line splits the key from the value. The first block is `PROTOCOL PREAMBLE:` with `Version: 1.2`. The initial dump ends with `END PRELUDE:`.

A change uses the same block the server sends. The video-mode example is `STREAM SETTINGS:`, then `Video Mode: 1080p59.94`, then a blank line. The server answers `ACK` or, if it cannot parse the block, `NACK`. After `ACK` the client should expect a status block. An unknown key is ignored. An invalid value for a known key is ignored, and the server still sends `ACK`, then a status block with the value it already had. The note's invalid example sends `Video Mode: UnsupportedMode`, gets `ACK`, and the following status block still shows `Video Mode: 1080p59.94`.

Stream control is the `STREAM STATE:` block. `Status` is read only. The valid values are Idle, Connecting, Streaming, and Interrupted. `Action` is write only, and the valid values are Start and Stop. The start example sends `Action: Start`, receives `ACK`, then `Status: Connecting`, then `Status: Streaming`. The stop example sends `Action: Stop`, receives `ACK`, then `Status: Idle`. The note says Status changes are pushed. Duration, Bitrate, and Cache Used change too often for that, so the client polls them by sending `STREAM STATE:` and a blank line. Duration is a string `DD:HH:MM:SS`. Bitrate is an integer in bits per second. Cache Used is an integer percentage.

[Play and record a Blackmagic HyperDeck over Ethernet](/use-cases/play-and-record-a-blackmagic-hyperdeck-over-ethernet) is TCP 9993, and its success line is `200 ok`. [Set Ultimatte 12 matte density over Ethernet](/use-cases/set-ultimatte-12-matte-density-over-ethernet) is TCP 9998. This note is TCP 9977, and the ack line is `ACK`.

## How to set it up

1. Open TCP port 9977 on the Streaming Encoder. Read until `END PRELUDE:`. The preamble's version line in this note is `Version: 1.2`. The identity example prints `Model: Blackmagic Streaming Encoder HD`.
2. Request the current stream block before changing it. Send `STREAM STATE:` and a blank line. `Status: Idle` is the stopped example. Duration, Bitrate, and Cache Used are the fields the note says to poll this way, because they are not pushed on every change.
3. Start with `STREAM STATE:`, then `Action: Start`, then a blank line. Wait for `ACK`. The printed follow-up is `Status: Connecting` and then `Status: Streaming`. Stop with `Action: Stop`. The printed follow-up is `Status: Idle`.
4. Treat `ACK` as "the block parsed," not as "the value was accepted." The unsupported video-mode example is still answered with `ACK`, and the next status block keeps `1080p59.94`. `NACK` is the reply when the block cannot be parsed.
5. Do not send `SHUTDOWN:` with `Action: Factory Reset`. The note says that sets every setting back to factory defaults. `Action: Reboot` is also in that block, and the note says the server stops and clients are disconnected.

Source: [Blackmagic Streaming Encoder Ethernet Protocol, January 2026](https://documents.blackmagicdesign.com/DeveloperManuals/WebPresenterEthernetProtocol.pdf).

## FAQ

### Is port 9977 the HyperDeck port?
No. This note puts the Streaming Encoder server on TCP 9977. The HyperDeck entry linked above is TCP 9993 and uses `200 ok`. The Ultimatte entry is TCP 9998.

### Does ACK mean the stream started?
The start example does send `ACK` and then `Status: Connecting` and `Status: Streaming`. The video-mode section also sends `ACK` when the value is invalid, and then reports the old value. Read the `Status` line after the ack. The valid status names are Idle, Connecting, Streaming, and Interrupted.

### Why does the URL say WebPresenter?
The January 2026 PDF at that URL is titled Blackmagic Streaming Encoder Ethernet Protocol and names the Streaming Encoder HD and the Streaming Encoder 4K. The path of the file still contains `WebPresenterEthernetProtocol.pdf`. The protocol version printed in the preamble is 1.2.
