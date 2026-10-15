---
title: "Send and receive arbitrary OSC from Companion buttons"
slug: send-and-receive-arbitrary-osc-from-companion-buttons
category: "Show Control"
tools: ["Bitfocus Companion", "OSC"]
difficulty: Beginner
source_url: https://bitfocus.io/connections/generic-osc
summary: "Companion's Generic OSC connection sends integers, floats, strings, blobs and multi-argument messages to any OSC device, and exposes received messages as variables."
---

## What it does

Companion's Generic OSC connection sends integers, floats, strings, blobs and multi-argument messages to any OSC device, and exposes received messages as variables.

## How to set it up

1. Add an OSC Generic connection and set the target IP and port.
2. Put Send actions on buttons with the OSC path and value.
3. Turn on listening to capture incoming messages into variables like $(osc:latest_received_path).
4. Use those variables in triggers so devices or agents that speak OSC can drive Companion.

Source: [Bitfocus connection docs](https://bitfocus.io/connections/generic-osc)

## FAQ

### Is the boolean type standard?
No. The module notes boolean isn't part of the OSC standard and may only work with some receivers.

### Can I read arguments?
Yes, with expressions like $(osc:latest_received_args)[0].
