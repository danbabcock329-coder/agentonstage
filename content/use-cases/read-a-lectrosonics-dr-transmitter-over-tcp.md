---
title: "Read a Lectrosonics DR transmitter over TCP"
slug: read-a-lectrosonics-dr-transmitter-over-tcp
category: "Audio"
tools: ["Lectrosonics DR", "TCP"]
difficulty: Intermediate
source_url: https://www.lectrosonics.com/wdsupport/WebHelp/dr/protocol/dr_cmd_proto.html
labels: ["Commercial product"]
summary: "A Lectrosonics DR's factory primary TCP port is 4080. !txstat(1)? plus a carriage return returns an 8-integer transmitter status array."
---

## What it does

Wireless Designer's network page says a DR frame accepts third-party control on two TCP ports. The primary port is set on the frame's Network tab. The factory default it prints is 4080. The secondary port is always the next number, 4081 when the primary is 4080. Both ports do the same work. The page says to put Wireless Designer on the secondary while a control client uses the primary, so the two are not on one port. The IP in its example, 172.16.2.137, is an example, not a default.

The DR control language is text, one request then one response. A request ends with a carriage return, `0x0D`. A response ends with carriage return and line feed. Wait for the response before you send another request. Prefix the request with `!` for a verbose response, which repeats the property name and address. The protocol page's example is `!serial?` answered by `OK serial="5000101"`. A bad target name or an address out of range comes back as `ERROR` and no data.

`txstat` is the live transmitter read. The command page says the address is 1 to 6, the payload is an array of 8 integers, and the data is valid only when link status is 1. The documented query and reply are:

`!txstat(1)?`

`OK txstat(1)={1,72,0,0,0,-18,0,0}`

Positions, in order: link (0 none, 1 established), battery timer in minutes, battery warning (0 ok, 1 under 25%, 2 under 10%, 4 timer alarm), mute (0 unmuted, 1 muted), front-panel lock (0 unlocked, 1 locked), audio meter from -80 to +5 dB referenced to the limiter threshold, limiter (0 or 1), clipping (0 or 1).

## How to set it up

1. Read the frame's Network tab for the IP and the primary TCP port. Use 4080 only when that tab still shows the factory default. If Wireless Designer is already connected, use the secondary port, which is the next number.
2. Open one TCP connection. Send a single line ending in `0x0D`, then read until `0x0D 0x0A`. Do not pipeline the next command.
3. Send `!txstat(1)?` for channel 1. Channel addresses on this command are 1 through 6. The verbose reply names the property, so a later poll is still identifiable.
4. Read the first integer before the rest. The command page says the other seven values are valid only when that link status is 1. Position 4 is mute. Position 6 is the meter, from -80 to +5. Position 8 is clipping.
5. If the reply is `ERROR`, the page lists a misspelled target or an out-of-range address as the usual cause. Fix the text. Do not send an update from this status array.

Source: [DR control protocol](https://www.lectrosonics.com/wdsupport/WebHelp/dr/protocol/dr_cmd_proto.html), [connect over the network](https://www.lectrosonics.com/wdsupport/WebHelp/connect/connect_net.html), and [transmitter commands](https://www.lectrosonics.com/wdsupport/WebHelp/dr/commands/dr_tx_cmds.html).

## FAQ

### Is 4080 always the port?
It is the factory default the connect page gives for the primary port. The Network tab can change it. The secondary port is not set on its own. It is the next integer after the primary.

### What does a first value of 0 mean?
No link. The `txstat` page says the rest of the array is valid only when link status is 1. A muted pack that is linked is position 4 equal to 1, with position 1 still 1.

### Why the exclamation point?
That is verbose mode. The protocol page says the response then includes the property name and address, so the client can parse it without remembering which query is in flight. `OK` is success. `ERROR` is not.
